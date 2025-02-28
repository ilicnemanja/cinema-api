import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/dtos/role.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dtos/create-showtime.dto';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('/create')
  async createShowtime(@Body() createShowtime: CreateShowtimeDto) {
    try {
      return await this.showtimesService.createShowtime(createShowtime);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer, Role.Admin)
  @Get('search/:showtimeId')
  async searchShowtimeById(@Param('showtimeId') showtimeId: number) {
    try {
      return await this.showtimesService.searchShowtimeById(showtimeId);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer, Role.Admin)
  @Get('active')
  async searchAllActiveShowtimes() {
    try {
      return await this.showtimesService.searchAllActiveShowtimes();
    } catch (error) {
      throw error;
    }
  }
}
