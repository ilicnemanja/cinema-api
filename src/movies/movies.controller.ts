import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Role } from 'src/auth/dtos/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateMovieDto } from './dtos/update-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer, Role.Admin)
  @Get('search/:movieId')
  async searchMovieById(@Param('movieId') movieId: string) {
    try {
      return await this.moviesService.searchMovieById(movieId);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('create')
  async createMovie(@Body() createMovieDto: CreateMovieDto) {
    try {
      return await this.moviesService.createMovie(createMovieDto);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put('update/:movieId')
  async updateMovie(
    @Param('movieId') movieId: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    try {
      return await this.moviesService.updateMovie(movieId, updateMovieDto);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('delete/:movieId')
  async deleteMovie(@Param('movieId') movieId: string) {
    try {
      return await this.moviesService.deleteMovie(movieId);
    } catch (error) {
      throw error;
    }
  }
}
