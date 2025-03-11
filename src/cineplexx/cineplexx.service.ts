import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class CineplexxService {
  constructor(
    private readonly httpService: HttpService,
    private readonly redisService: RedisService,
  ) {}

  async getCineplexxCatalog(date: string) {
    try {
      // check if the data is in the cache
      const cachedData = await this.redisService.getMoviesForDate(date);
      if (cachedData.length) {
        return cachedData;
      }

      const response = await lastValueFrom(
        this.httpService.get(
          `https://app.cineplexx.rs/api/v2/movies?date=${date}&location=all`,
          {
            headers: {
              Accept: '*/*',
              'Accept-Language': 'sr',
              'CINEPLEXX-Platform': 'WEB',
              Connection: 'keep-alive',
              'Content-Type': 'application/json;charset=UTF-8',
              Host: 'app.cineplexx.rs',
              Origin: 'https://www.cineplexx.rs',
              Referer: 'https://www.cineplexx.rs/',
              'User-Agent':
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
            },
          },
        ),
      );

      const data = response.data;

      this.redisService.storeAllMoviesFor5H(data, date);

      return data;
    } catch (error) {
      console.error('Error fetching Cineplexx catalog:', error.message);
      throw error;
    }
  }
}
