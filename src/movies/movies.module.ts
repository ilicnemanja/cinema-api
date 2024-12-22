import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movies } from './entities/movies.entity';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { Genres } from 'src/genres/entities/genres.entity';
import { MovieGenre } from 'src/movie-genre/entities/movie_genre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movies, Genres, MovieGenre])],
  providers: [MoviesService],
  controllers: [MoviesController],
})
export class MoviesModule {}
