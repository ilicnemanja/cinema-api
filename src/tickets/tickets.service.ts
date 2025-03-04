import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Tickets } from './entities/tickets.entity';
import { DataSource, Repository } from 'typeorm';
import { ShowtimesService } from 'src/showtimes/showtimes.service';
import { SeatsService } from 'src/seats/seats.service';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Tickets) private ticketRepository: Repository<Tickets>,
    private readonly showtimeService: ShowtimesService,
    private readonly stripeService: StripeService,
    private readonly seatsService: SeatsService,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async findAllByShowtimeAndUserId(userId: string, showtimeId: number) {
    const result = await this.ticketRepository.find({
      where: { user_id: userId, showtime_id: showtimeId },
    });

    if (!result) {
      return {
        status: 'success',
        message: 'Ticket not found',
      };
    }

    return {
      status: 'success',
      message: 'Ticket found',
      data: result,
    };
  }

  async findAllByShowtime(showtimeId: number) {
    const result = await this.ticketRepository.find({
      where: { showtime_id: showtimeId },
    });

    if (!result) {
      return {
        status: 'success',
        message: 'Ticket not found',
      };
    }

    return {
      status: 'success',
      message: 'Ticket found',
      data: result,
    };
  }

  async createTicket(userId: string, createTicketDto: CreateTicketDto) {
    const showtime = await this.showtimeService.searchShowtimeById(
      createTicketDto.showtimeId,
    );

    if (!showtime.data.showtime) {
      return {
        status: 'error',
        message: 'Showtime not found',
      };
    }

    const availableSeats = await this.seatsService.getAvailableSeats(
      createTicketDto.showtimeId,
      showtime.data.showtime.hall.id,
    );
    const availableSeatIds = availableSeats.data.seats.map((seat) => seat.id);

    const unavailableSeats = createTicketDto.seatIds.filter(
      (seatId) => !availableSeatIds.includes(seatId),
    );

    if (unavailableSeats.length > 0) {
      throw new HttpException(
        `Seats ${unavailableSeats.join(', ')} are already booked`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const ticketsReserved: Tickets[] = [];
    let totalAmount = 0;
    let paymentIntent = null;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const seatId of createTicketDto.seatIds) {
        const ticket = queryRunner.manager.create(Tickets, {
          user_id: userId,
          showtime_id: createTicketDto.showtimeId,
          seat_id: seatId,
          status: createTicketDto.isForPay ? 'PENDING_PAYMENT' : 'RESERVED',
        });

        await queryRunner.manager.save(ticket);

        ticketsReserved.push(ticket);
        totalAmount += 500; // TODO: add price based on showtime or hall
      }

      if (createTicketDto.isForPay) {
        paymentIntent = await this.stripeService.createPaymentIntent(
          totalAmount,
          'usd',
          {
            userId: userId,
            tickets: JSON.stringify(
              ticketsReserved.map((ticket) => {
                return {
                  ticket_id: ticket.id,
                  seat_id: ticket.seat_id,
                  showtime_id: ticket.showtime_id,
                };
              }),
            ),
          },
        );
      }

      // commit transaction now:
      await queryRunner.commitTransaction();
    } catch (err) {
      if (paymentIntent && paymentIntent.id) {
        await this.stripeService.cancelPaymentIntent(paymentIntent.id);
      }

      // since we have errors let's rollback changes we made
      await queryRunner.rollbackTransaction();

      throw new HttpException(
        `Failed to create reservation: ${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      // you need to release query runner which is manually created:
      await queryRunner.release();
    }

    return {
      status: 'success',
      message: 'Reservation created',
      data: {
        length: ticketsReserved.length,
        tickets: ticketsReserved,
        totalAmount,
        paymentIntent,
      },
    };
  }

  async cancelTicket(userId: string, ticketId: number) {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId, user_id: userId },
    });

    if (!ticket) {
      return {
        status: 'error',
        message: 'Ticket not found',
      };
    }

    if (ticket.status === 'SOLD') {
      return {
        status: 'error',
        message: 'Ticket already sold, cannot be cancelled',
      };
    }

    await this.ticketRepository.delete(ticketId);

    return {
      status: 'success',
      message: 'Reservation cancelled',
    };
  }
}
