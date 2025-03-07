/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { QueryFailedError } from 'typeorm';
import { OAuth2Client } from 'google-auth-library';
import configuration from 'src/utils/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ accessToken: string }> {
    try {
      const user = await this.validateUser(email, pass);

      if (!user) {
        throw new UnauthorizedException({ message: 'Invalid credentials' });
      }

      const payload = {
        sub: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider,
        photoUrl: user.photoUrl || '',
      };

      return {
        accessToken: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    try {
      const user = await this.usersService.findOne(email);

      if (!user) return null;

      const isValid = bcrypt.compareSync(pass, user.password);

      if (isValid) {
        const { password, ...result } = user;
        return result;
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `An unexpected error occurred: ${error.message}`,
      );
    }
  }

  async signUp(user: any): Promise<any> {
    try {
      const salt = bcrypt.genSaltSync(10);
      user.id = uuidv4();
      user.password = bcrypt.hashSync(user.password, salt);

      return await this.usersService.create(user);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException('User already exists');
      }
      throw new InternalServerErrorException(
        `An unexpected error occurred: ${error.message}`,
      );
    }
  }

  async googleAuth(idToken: string | undefined): Promise<any> {
    try {
      if (!idToken) {
        throw new UnauthorizedException('Invalid token');
      }

      const client = new OAuth2Client(configuration.auth.googleClientId);

      const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: configuration.auth.googleClientId,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException('Invalid token');
      }

      let user = await this.usersService.findOne(payload.email);

      if (!user) {
        user = await this.usersService.create({
          id: uuidv4(),
          name: `${payload.given_name} ${payload.family_name}`,
          photoUrl: payload.picture,
          email: payload.email,
          password: '',
          role: 'CUSTOMER',
          provider: 'GOOGLE',
        });
      }

      const jwtPayload = {
        sub: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider,
        photoUrl: user.photoUrl || '',
      };

      const { password, ...result } = user;
      const accessToken = await this.jwtService.signAsync(jwtPayload);

      return {
        accessToken: accessToken,
        user: result,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `An unexpected error occurred: ${error.message}`,
      );
    }
  }
}
