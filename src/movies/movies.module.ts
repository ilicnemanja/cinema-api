import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movies } from './entities/movies.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movies])],
})
export class MoviesModule {}
