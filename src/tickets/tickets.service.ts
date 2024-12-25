import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tickets } from './entities/tickets.entity';
import { Repository } from 'typeorm';
import { ShowtimesService } from 'src/showtimes/showtimes.service';
import { SeatsService } from 'src/seats/seats.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Tickets) private ticketRepository: Repository<Tickets>,
    private readonly showtimeService: ShowtimesService,
    private readonly seatsService: SeatsService,
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

  async createTicket(userId: string, showtimeId: number, seatId: number) {
    const showtime = await this.showtimeService.searchShowtimeById(showtimeId);

    if (!showtime.data.showtime) {
      return {
        status: 'error',
        message: 'Showtime not found',
      };
    }

    const isSeatAvailable = await this.seatsService.checkSeatAvailability(
      seatId,
      showtimeId,
    );

    if (!isSeatAvailable) {
      return {
        status: 'error',
        message: 'Seat not available',
      };
    }

    const ticket = this.ticketRepository.create({
      user_id: userId,
      showtime_id: showtimeId,
      seat_id: seatId,
      status: 'RESERVED',
    });

    await this.ticketRepository.save(ticket);

    return {
      status: 'success',
      message: 'Reservation created',
      data: ticket,
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
