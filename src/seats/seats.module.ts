import { Module } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seats } from './entities/seats.entity';
import { SeatsController } from './seats.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Seats])],
  providers: [SeatsService],
  controllers: [SeatsController],
})
export class SeatsModule {}
