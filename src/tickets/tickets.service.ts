import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Tickets } from './entities/tickets.entity';
import { DataSource, Repository } from 'typeorm';
import { ShowtimesService } from 'src/showtimes/showtimes.service';
import { SeatsService } from 'src/seats/seats.service';
import { CreateTicketDto } from './dtos/create-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Tickets) private ticketRepository: Repository<Tickets>,
    private readonly showtimeService: ShowtimesService,
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

    const ticketsReserved: Tickets[] = [];

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const seatId of createTicketDto.seatIds) {
        const isSeatAvailable = await this.seatsService.checkSeatAvailability(
          seatId,
          createTicketDto.showtimeId,
        );

        if (!isSeatAvailable) {
          throw new HttpException('Seat not available', HttpStatus.BAD_REQUEST);
        }

        const ticket = queryRunner.manager.create(Tickets, {
          user_id: userId,
          showtime_id: createTicketDto.showtimeId,
          seat_id: seatId,
          status: createTicketDto.isForPay ? 'SOLD' : 'RESERVED',
        });

        await queryRunner.manager.save(ticket);

        ticketsReserved.push(ticket);
      }

      if (createTicketDto.isForPay) {
        // TODO: payment logic here
        // ...
      }

      // commit transaction now:
      await queryRunner.commitTransaction();
    } catch (err) {
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
