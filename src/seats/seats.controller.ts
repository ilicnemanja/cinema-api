import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { GetSeatsDto } from './dtos/get-seats.dto';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Get('/')
  getSeats(@Query() query: GetSeatsDto) {
    try {
      const { status, showtimeId } = query;
      return this.seatsService.getSeatsByStatusAndShowtime(status, showtimeId);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
