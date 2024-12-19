import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Showtimes } from './entities/showtimes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Showtimes])],
})
export class ShowtimesModule {}
