import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Showtimes } from './entities/showtimes.entity';
import { Repository } from 'typeorm';
import { CreateShowtimeDto } from './dtos/create-showtime.dto';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtimes)
    private showtimeRepository: Repository<Showtimes>,
  ) {}

  async createShowtime(createShowtime: CreateShowtimeDto) {
    const showtime = await this.showtimeRepository.create(createShowtime);
    await this.showtimeRepository.save(showtime);

    return {
      status: 'success',
      message: 'Showtime created successfully',
      data: {
        showtime,
      },
    };
  }

  async searchShowtimeById(showtimeId: number) {
    const showtime = await this.showtimeRepository.findOne({
      where: { id: showtimeId },
      relations: ['movie', 'hall'],
    });

    if (!showtime) {
      return {
        status: 'error',
        message: 'Showtime not found',
      };
    }

    return {
      status: 'success',
      message: 'Showtime found',
      data: {
        showtime,
      },
    };
  }

  async searchAllActiveShowtimes() {
    const showtimes = await this.showtimeRepository.find({
      relations: ['movie', 'hall'],
      where: { isActive: true },
    });

    if (!showtimes) {
      return {
        status: 'error',
        message: 'Showtimes not found',
      };
    }

    return {
      status: 'success',
      message: 'Showtimes found',
      data: {
        length: showtimes.length,
        showtimes,
      },
    };
  }
}
