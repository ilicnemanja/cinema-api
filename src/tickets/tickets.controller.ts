import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @UseGuards(AuthGuard)
  @Get('find-one')
  findOneByShowtime(@Request() req, @Query('showtimeId') showtimeId: number) {
    return this.ticketsService.findOneByShowtime(req.user.sub, showtimeId);
  }
}
