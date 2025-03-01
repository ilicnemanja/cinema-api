import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { GetSeatsDto } from './dtos/get-seats.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/dtos/role.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateSeatsDto } from './dtos/create-seats.dto';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer, Role.Admin)
  @Post('/lock')
  async lockSeat(
    @Query() query: { showtimeId: number },
    @Body()
    body: {
      showtimeId: number;
      movieId: string;
      seatRow: number;
      seatNumber: number;
    },
  ) {
    try {
      const { showtimeId } = query;
      const { movieId, seatRow, seatNumber } = body;
      return await this.seatsService.lockSeat(
        showtimeId,
        movieId,
        seatRow,
        seatNumber,
      );
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer, Role.Admin)
  @Get('/locked')
  getLockedSeats(
    @Query() query: GetSeatsDto,
    @Body() body: { movieId: string },
  ) {
    try {
      const { showtimeId } = query;
      const { movieId } = body;
      return this.seatsService.getLockedSeats(showtimeId, movieId);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer, Role.Admin)
  @Post('/unlock')
  async unlockSeat(
    @Query() query: { showtimeId: number },
    @Body() body: { movieId: string; seatRow: number; seatNumber: number },
  ) {
    try {
      const { showtimeId } = query;
      const { movieId, seatRow, seatNumber } = body;
      return await this.seatsService.unlockSeat(
        showtimeId,
        movieId,
        seatRow,
        seatNumber,
      );
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer, Role.Admin)
  @Get('/available')
  getAvailableSeats(@Query() query: GetSeatsDto) {
    try {
      const { showtimeId } = query;
      return this.seatsService.getAvailableSeats(showtimeId);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer, Role.Admin)
  @Get('/reserved')
  getReservedSeats(@Query() query: GetSeatsDto) {
    try {
      const { showtimeId } = query;
      return this.seatsService.getReservedSeats(showtimeId);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('create')
  async createSeats(@Body() createSeatsDto: CreateSeatsDto[]) {
    try {
      return await this.seatsService.createSeats(createSeatsDto);
    } catch (error) {
      throw error;
    }
  }
}
