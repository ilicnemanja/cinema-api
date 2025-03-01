import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Seats } from './entities/seats.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CreateSeatsDto } from './dtos/create-seats.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seats) private seatsRepository: Repository<Seats>,
    @InjectDataSource() private dataSource: DataSource,
    private readonly redisService: RedisService,
  ) {}

  async lockSeat(
    showtimeId: number,
    movieId: string,
    seatRow: number,
    seatNumber: number,
  ) {
    await this.redisService.lockSeat(
      showtimeId,
      movieId,
      seatRow.toString(),
      seatNumber.toString(),
      60,
    );

    return {
      status: 'success',
      message: 'Seat locked successfully',
    };
  }

  async getLockedSeats(showtimeId: number, movieId: string) {
    const lockedSeats = await this.redisService.getLockedSeats(
      showtimeId,
      movieId,
    );

    return {
      status: 'success',
      message: 'Locked seats fetched successfully',
      data: {
        length: lockedSeats.length,
        seats: lockedSeats,
      },
    };
  }

  async unlockSeat(
    showtimeId: number,
    movieId: string,
    seatRow: number,
    seatNumber: number,
  ) {
    await this.redisService.unlockSeat(
      showtimeId,
      movieId,
      seatRow.toString(),
      seatNumber.toString(),
    );

    return {
      status: 'success',
      message: 'Seat unlocked successfully',
    };
  }

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
    const seats = createSeatsDto.map((dto) => ({
      ...dto,
      hall: { id: dto.hall_id },
    }));

    const result = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Seats)
      .values(seats)
      .execute();

    if (!result) {
      return {
        status: 'error',
        message: 'Seats creation failed',
      };
    }

    return {
      status: 'success',
      message: 'Seats created successfully',
      data: {
        length: result.identifiers.length,
        seats: result.identifiers,
      },
    };
  }
}
