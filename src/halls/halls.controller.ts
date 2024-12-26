import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/dtos/role.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { HallsService } from './halls.service';
import { CreateHallDto } from './dtos/create-hall.dto';

@Controller('halls')
export class HallsController {
  constructor(private readonly hallsService: HallsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('/create')
  createHall(@Body() createHallDto: CreateHallDto) {
    try {
      return this.hallsService.create(createHallDto);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('/delete/:hallId')
  async deleteHall(@Param('hallId') hallId: number) {
    try {
      return this.hallsService.delete(hallId);
    } catch (error) {
      throw error;
    }
  }
}