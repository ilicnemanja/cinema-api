import { Module } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seats } from './entities/seats.entity';
import { SeatsController } from './seats.controller';
import { RedisService } from 'src/redis/redis.service';
import { ShowtimesModule } from 'src/showtimes/showtimes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Seats]), ShowtimesModule],
  providers: [SeatsService, RedisService],
  controllers: [SeatsController],
  exports: [SeatsService],
})
export class SeatsModule {}
