import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { TicketsService } from './tickets.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/dtos/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('find-one')
  findOneByShowtime(@Request() req, @Query('showtimeId') showtimeId: number) {
    return this.ticketsService.findOneByShowtime(req.user.sub, showtimeId);
  }
}
