/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.validateUser(email, pass);

    if (!user) {
      throw new UnauthorizedException({ message: 'Invalid credentials' });
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if (!user) return null;

    const isValid = bcrypt.compareSync(pass, user.password);

    if (isValid) {
      const { password, ...result } = user;
      return result;
    }
  }

  async signUp(user: any): Promise<any> {
    const salt = bcrypt.genSaltSync(10);
    user.id = uuidv4();
    user.password = bcrypt.hashSync(user.password, salt);

    return this.usersService.create(user);
  }
}
