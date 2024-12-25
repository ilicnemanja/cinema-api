import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Showtimes } from './entities/showtimes.entity';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { Movies } from 'src/movies/entities/movies.entity';
import { Hall } from 'src/halls/entities/hall.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Showtimes, Movies, Hall])],
  controllers: [ShowtimesController],
  providers: [ShowtimesService],
  exports: [ShowtimesService],
})
export class ShowtimesModule {}
