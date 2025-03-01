import { Module } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seats } from './entities/seats.entity';
import { SeatsController } from './seats.controller';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([Seats])],
  providers: [SeatsService, RedisService],
  controllers: [SeatsController],
  exports: [SeatsService],
})
export class SeatsModule {}
