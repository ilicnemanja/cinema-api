import { Controller, Get, Query } from '@nestjs/common';
import { Users } from './entities/users.entity';
import { UsersService } from './users.service';
import { ApiQuery } from '@nestjs/swagger';
import { ApiUsers } from 'src/utils/swagger/users';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiQuery(ApiUsers.ApiFindOneQuery)
  @Get('/find-one')
  async findOne(@Query('email') email: string): Promise<Users> {
    return this.usersService.findOne(email);
  }
}
