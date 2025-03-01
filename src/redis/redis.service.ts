import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import configuration from 'src/utils/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  async onModuleInit() {
    this.client = new Redis({
      host: configuration.redis.host,
      port: Number(configuration.redis.port),
    });
  }

  async lockSeat(
    showtimeId: number,
    movieId: string,
    seatRow: string,
    seatNumber: string,
    expirationInSeconds: number,
  ): Promise<boolean> {
    const seatKey = `seat:${showtimeId}:${movieId}:${seatRow}-${seatNumber}`;
    const isSet = await this.client.set(
      seatKey,
      'locked',
      'EX',
      expirationInSeconds,
      'NX',
    );
    return !!isSet;
  }

  async getLockedSeats(showtimeId: number, movieId: string): Promise<string[]> {
    const keys = await this.client.keys(`seat:${showtimeId}:${movieId}:*`);

    if (keys.length === 0) {
      return [];
    }

    const lockedSeats = await this.client.mget(...keys);
    return keys.filter((_, index) => lockedSeats[index] === 'locked');
  }

  async unlockSeat(
    showtimeId: number,
    movieId: string,
    seatRow: string,
    seatNumber: string,
  ): Promise<void> {
    const seatKey = `seat:${showtimeId}:${movieId}:${seatRow}-${seatNumber}`;
    await this.client.del(seatKey);
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
