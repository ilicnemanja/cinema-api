import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Seats } from './entities/seats.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seats) private seatsRepository: Repository<Seats>,
  ) {}

  async getSeatsByStatusAndShowtime(
    status: 'AVAILABLE' | 'RESERVED' | 'SOLD' | null,
    showtimeId: number,
  ) {
    try {
      const result = await this.seatsRepository
        .query(`SELECT s.\`row_number\`, s.number AS seat_number, h.name AS hall_name, s.status
        FROM seats s
        JOIN hall h ON s.hall_id = h.id
        JOIN showtime st ON st.hall_id = h.id
        LEFT JOIN ticket t ON t.seat_id = s.id AND t.showtime_id = st.id
        WHERE st.id = ${showtimeId} ${status ? `AND s.status = '${status}'` : ''};`);

      return {
        status: 'success',
        message: 'Seats retrieved successfully',
        data: {
          length: result.length,
          seats: result,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
