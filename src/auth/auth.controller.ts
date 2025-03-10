import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { SignUpDto } from './dtos/sign-up.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ApiAuth } from 'src/utils/swagger/auth';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody(ApiAuth.ApiLoginBody)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(
      signInDto.email,
      signInDto.password,
      signInDto.captcha,
    );
  }

  @ApiBody(ApiAuth.ApiRegisterBody)
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @ApiBearerAuth()
  @Post('google')
  async googleAuth(@Body() body) {
    return this.authService.googleAuth(body.idToken);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
