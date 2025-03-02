import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Showtimes } from './entities/showtimes.entity';
import { Repository } from 'typeorm';
import { CreateShowtimeDto } from './dtos/create-showtime.dto';
import { Movies } from 'src/movies/entities/movies.entity';
import { Hall } from 'src/halls/entities/hall.entity';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtimes)
    private showtimeRepository: Repository<Showtimes>,
    @InjectRepository(Movies)
    private movieRepository: Repository<Movies>,
    @InjectRepository(Hall)
    private hallRepository: Repository<Hall>,
  ) {}

  async createShowtime(createShowtime: CreateShowtimeDto) {
    const movie = await this.movieRepository.findOne({
      where: { id: createShowtime.movie_id },
    });

    const hall = await this.hallRepository.findOne({
      where: { id: createShowtime.hall_id },
    });

    const showtime = await this.showtimeRepository.create({
      ...createShowtime,
      movie,
      hall,
    });

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
