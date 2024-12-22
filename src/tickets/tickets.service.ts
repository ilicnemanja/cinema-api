import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tickets } from './entities/tickets.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Tickets) private ticketRepository: Repository<Tickets>,
  ) {}

  async findAllByShowtime(userId: string, showtimeId: number) {
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
}
