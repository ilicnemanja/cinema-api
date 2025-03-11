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

  async storeAllMoviesFor5H(movies: any[], date: string): Promise<void> {
    await this.client.set(
      `cineplexx-movies-date:${date}`,
      JSON.stringify(movies),
      'EX',
      18000,
    );
  }

  async getMoviesForDate(date: string): Promise<any[]> {
    const key = await this.client.keys(`cineplexx-movies-date:${date}`);

    if (key.length === 0) {
      return [];
    }

    const movies = await this.client.get(key[0]);
    return JSON.parse(movies);
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
