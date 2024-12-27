import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { TicketsService } from './tickets.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/dtos/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateTicketDto } from './dtos/create-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer, Role.Admin)
  @Get('/')
  findAllTicketsForUser(
    @Request() req,
    @Query('showtimeId') showtimeId: number,
  ) {
    return this.ticketsService.findAllByShowtimeAndUserId(
      req.user.sub,
      showtimeId,
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('/showtime/:showtimeId')
  findAllTicketsByShowtime(@Param('showtimeId') showtimeId: number) {
    return this.ticketsService.findAllByShowtime(showtimeId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer, Role.Admin)
  @Post('create')
  async createTicket(@Request() req, @Body() createTicketDto: CreateTicketDto) {
    try {
      return await this.ticketsService.createTicket(
        req.user.sub,
        createTicketDto,
      );
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer, Role.Admin)
  @Delete('cancel')
  async cancelTicket(@Request() req, @Query('ticketId') ticketId: number) {
    try {
      return await this.ticketsService.cancelTicket(req.user.sub, ticketId);
    } catch (error) {
      throw error;
    }
  }
}
