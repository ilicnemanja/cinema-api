import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { GetSeatsDto } from './dtos/get-seats.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/dtos/role.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateSeatsDto } from './dtos/create-seats.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ApiSeats } from 'src/utils/swagger/seats';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @ApiBearerAuth()
  @ApiBody(ApiSeats.ApiBodyForLockSeats)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer, Role.Admin)
  @Post('/lock/:showtimeId')
  async lockSeat(
    @Param() params: { showtimeId: number },
    @Body()
    body: {
      showtimeId: number;
      movieId: string;
      seatRow: number;
      seatNumber: number;
    },
  ) {
    try {
      const { showtimeId } = params;
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

  @ApiBearerAuth()
  @ApiBody(ApiSeats.ApiBodyForGetLockedSeats)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer, Role.Admin)
  @Get('/locked/:showtimeId')
  getLockedSeats(
    @Param() params: GetSeatsDto,
    @Body() body: { movieId: string },
  ) {
    try {
      const { showtimeId } = params;
      const { movieId } = body;
      return this.seatsService.getLockedSeats(showtimeId, movieId);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiBody(ApiSeats.ApiBodyForUnlockSeats)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer, Role.Admin)
  @Post('/unlock/:showtimeId')
  async unlockSeat(
    @Param() params: { showtimeId: number },
    @Body() body: { movieId: string; seatRow: number; seatNumber: number },
  ) {
    try {
      const { showtimeId } = params;
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer, Role.Admin)
  @Get('/available/:showtimeId')
  getAvailableSeats(@Param() params: GetSeatsDto) {
    try {
      const { showtimeId } = params;
      return this.seatsService.getAvailableSeats(showtimeId);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer, Role.Admin)
  @Get('/reserved/:showtimeId')
  getReservedSeats(@Param() params: GetSeatsDto) {
    try {
      const { showtimeId } = params;
      return this.seatsService.getReservedSeats(showtimeId);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiBody(ApiSeats.ApiCreateSeatsListBody)
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
