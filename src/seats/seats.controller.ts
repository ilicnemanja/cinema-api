import { Controller, Get, Query } from '@nestjs/common';
import { SeatsService } from './seats.service';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Get('available')
  getAvailableSeats(@Query('showtimeId') showtimeId: number) {
    return this.seatsService.getAvailableSeats(showtimeId);
  }
}
