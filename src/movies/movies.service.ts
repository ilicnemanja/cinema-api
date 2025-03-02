/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movies } from './entities/movies.entity';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { convertDecimalToTime } from 'src/utils/convert.util';
import { Genres } from 'src/genres/entities/genres.entity';
import { v4 as uuidv4 } from 'uuid';
import { UpdateMovieDto } from './dtos/update-movie.dto';
import { MovieGenre } from 'src/movie-genre/entities/movie_genre.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movies)
    private readonly moviesRepository: Repository<Movies>,
    @InjectRepository(Genres)
    private readonly genresRepository: Repository<Genres>,
    @InjectRepository(MovieGenre)
    private readonly movieGenreRepository: Repository<MovieGenre>,
  ) {}

  async searchAllMovies() {
    const movies = await this.moviesRepository.find({
      relations: ['genres'],
    });

    const convertedMovies = movies.map((movie) => {
      const { release_date, duration, genres, ...result } = movie;
      const convertedDuration = convertDecimalToTime(duration);

      return {
        ...result,
        release_date: new Date(release_date).toLocaleDateString(),
        duration: `${convertedDuration.hours}h ${convertedDuration.minutes}m`,
        genres: genres.map((genre) => genre.name),
      };
    });

    return {
      status: 'success',
      message: 'Movies found',
      data: {
        movies: convertedMovies,
      },
    };
  }

  async searchMovieById(movieId: string) {
    const result = await this.moviesRepository.findOne({
      where: { id: movieId },
      relations: ['genres'],
    });

    if (!result) {
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
    }

    const { release_date, duration, genres, ...movie } = result;
    const convertedDuration = convertDecimalToTime(duration);

    return {
      status: 'success',
      message: 'Movie found',
      data: {
        movie: {
          ...movie,
          release_date: new Date(release_date).toLocaleDateString(),
          duration: `${convertedDuration.hours}h ${convertedDuration.minutes}m`,
          genres: genres.map((genre) => genre.name),
        },
      },
    };
  }

  async createMovie(createMovieDto: CreateMovieDto) {
    const genres = await Promise.all(
      createMovieDto.genres.map(async (genreName) => {
        const genre = await this.genresRepository.findOne({
          where: { name: genreName },
        });

        if (!genre) {
          throw new HttpException(
            `Genre '${genreName}' doesn't exist`,
            HttpStatus.BAD_REQUEST,
          );
        }

        return genre;
      }),
    );

    const movie = this.moviesRepository.create({
      id: uuidv4(),
      ...createMovieDto,
      genres,
    });

    await this.moviesRepository.save(movie);

    const { release_date, duration, ...result } = movie;
    const convertedDuration = convertDecimalToTime(duration);

    return {
      status: 'success',
      message: 'Movie created',
      data: {
        movie: {
          ...result,
          release_date: new Date(release_date).toLocaleDateString(),
          duration: `${convertedDuration.hours}h ${convertedDuration.minutes}m`,
          genres: genres.map((genre) => genre.name),
        },
      },
    };
  }

  async updateMovie(movieId: string, updateMovieDto: UpdateMovieDto) {
    const movie = await this.moviesRepository.findOne({
      where: { id: movieId },
      relations: ['genres'],
    });

    if (!movie) {
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
    }

    let genres = movie.genres;

    if (updateMovieDto.genres && updateMovieDto.genres.length > 0) {
      genres = await Promise.all(
        updateMovieDto.genres.map(async (genreName) => {
          const genre = await this.genresRepository.findOne({
            where: { name: genreName },
          });

          if (!genre) {
            throw new HttpException(
              `Genre '${genreName}' doesn't exist`,
              HttpStatus.BAD_REQUEST,
            );
          }

          return genre;
        }),
      );
    }

    // Remove old movie_genre relations (if any) before adding new ones
    await this.movieGenreRepository.delete({ movie_id: movie.id });

    // Add the new relations in the movie_genre table
    await Promise.all(
      genres.map(async (genre) => {
        const movieGenre = this.movieGenreRepository.create({
          movie_id: movie.id,
          genre_id: genre.id,
        });
        await this.movieGenreRepository.save(movieGenre);
      }),
    );

    // Update the movie (excluding the genres, which are handled separately)
    const { genres: _, ...updateMovieDtoWithoutGenres } = updateMovieDto;
    await this.moviesRepository.update(movieId, {
      ...updateMovieDtoWithoutGenres,
    });

    const updatedMovie = await this.moviesRepository.findOne({
      where: { id: movieId },
      relations: ['genres'],
    });

    const { release_date, duration, ...result } = updatedMovie;
    const convertedDuration = convertDecimalToTime(duration);

    return {
      status: 'success',
      message: 'Movie updated',
      data: {
        movie: {
          ...result,
          release_date: new Date(release_date).toLocaleDateString(),
          duration: `${convertedDuration.hours}h ${convertedDuration.minutes}m`,
          genres: updatedMovie.genres.map((genre) => genre.name),
        },
      },
    };
  }

  async deleteMovie(movieId: string) {
    const movie = await this.moviesRepository.findOne({
      where: { id: movieId },
    });

    if (!movie) {
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
    }

    await this.moviesRepository.delete(movieId);

    return {
      status: 'success',
      message: 'Movie deleted',
    };
  }
}
