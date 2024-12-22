import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { GetSeatsDto } from './dtos/get-seats.dto';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Get('/available')
  getAvailableSeats(@Query() query: GetSeatsDto) {
    try {
      const { showtimeId } = query;
      return this.seatsService.getAvailableSeats(showtimeId);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
