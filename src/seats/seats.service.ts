import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Seats } from './entities/seats.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seats) private seatsRepository: Repository<Seats>,
  ) {}

  async getAvailableSeats(showtimeId: number) {
    const result = await this.seatsRepository.query(`SELECT *
      FROM seats s
      WHERE NOT EXISTS (
          SELECT 1
          FROM ticket t
          WHERE t.seat_id = s.id
            AND t.showtime_id = ${showtimeId}
            AND (t.status = 'SOLD' OR t.status = 'RESERVED')
      );`);

    return {
      status: 'success',
      message: 'Seats fetched successfully',
      data: {
        length: result.length,
        seats: result,
      },
    };
  }
}
