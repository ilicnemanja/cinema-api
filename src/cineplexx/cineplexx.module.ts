import { Module } from '@nestjs/common';
import { CineplexxService } from './cineplexx.service';
import { CineplexxController } from './cineplexx.controller';
import { HttpModule } from '@nestjs/axios';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [HttpModule],
  providers: [CineplexxService, RedisService],
  controllers: [CineplexxController],
})
export class CineplexxModule {}
