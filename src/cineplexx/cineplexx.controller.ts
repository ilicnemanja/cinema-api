import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CineplexxService } from './cineplexx.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/dtos/role.enum';

@Controller('cineplexx')
export class CineplexxController {
  constructor(private readonly cineplexxService: CineplexxService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer, Role.Admin)
  @Get('catalog/:date')
  async getCineplexxCatalog(@Param('date') date: string) {
    try {
      return await this.cineplexxService.getCineplexxCatalog(date);
    } catch (error) {
      throw error;
    }
  }
}
