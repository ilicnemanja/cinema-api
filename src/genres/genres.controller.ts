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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/dtos/role.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dtos/create-genre.dto';
import { UpdateGenreDto } from './dtos/update-genre.dto';

@Controller('genres')
export class GenresController {
  constructor(private readonly genreService: GenresService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('create')
  createGenre(@Body() createGenreDto: CreateGenreDto) {
    try {
      return this.genreService.create(createGenreDto);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('/delete/:genreId')
  deleteGenre(@Param('genreId') genreId: number) {
    try {
      return this.genreService.remove(genreId);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Customer)
  @Get('/')
  findAll() {
    try {
      return this.genreService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Customer)
  @Get('/:genreId')
  findOne(@Param('genreId') genreId: number) {
    try {
      return this.genreService.findOne(genreId);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put('/update/:genreId')
  updateGenre(
    @Param('genreId') genreId: number,
    @Body() updateGenreDto: UpdateGenreDto,
  ) {
    try {
      return this.genreService.update(genreId, updateGenreDto);
    } catch (error) {
      throw error;
    }
  }
}
