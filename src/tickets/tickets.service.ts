import { Injectable } from '@nestjs/common';
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

    for (const seatId of createTicketDto.seatIds) {
      const isSeatAvailable = await this.seatsService.checkSeatAvailability(
        seatId,
        createTicketDto.showtimeId,
      );

      if (!isSeatAvailable) {
        return {
          status: 'error',
          message: `Seat ${seatId} not available`,
        };
      }

      // Should be inside a transaction

      const ticket = this.ticketRepository.create({
        user_id: userId,
        showtime_id: createTicketDto.showtimeId,
        seat_id: seatId,
        status: 'RESERVED',
      });

      await this.ticketRepository.save(ticket);

      ticketsReserved.push(ticket);
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

    await this.ticketRepository.delete(ticketId);

    return {
      status: 'success',
      message: 'Reservation cancelled',
    };
  }
}
