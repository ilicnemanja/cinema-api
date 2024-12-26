import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Seats } from './entities/seats.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSeatsDto } from './dtos/create-seats.dto';

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

  async getReservedSeats(showtimeId: number) {
    const result = await this.seatsRepository.query(`SELECT *
      FROM seats s
      WHERE EXISTS (
          SELECT 1
          FROM ticket t
          WHERE t.seat_id = s.id
            AND t.showtime_id = ${showtimeId}
            AND t.status = 'RESERVED'
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

  async checkSeatAvailability(seatId: number, showtimeId: number) {
    const result = await this.seatsRepository.query(`SELECT *
      FROM seats s
      WHERE s.id = ${seatId}
        AND NOT EXISTS (
            SELECT 1
            FROM ticket t
            WHERE t.seat_id = s.id
              AND t.showtime_id = ${showtimeId}
              AND (t.status = 'SOLD' OR t.status = 'RESERVED')
        );`);

    return result.length > 0;
  }

  async createSeats(createSeatsDto: CreateSeatsDto[]) {
    for (const seat of createSeatsDto) {
      const newSeat = this.seatsRepository.create(seat);
      await this.seatsRepository.save(newSeat);
    }
  }
}
