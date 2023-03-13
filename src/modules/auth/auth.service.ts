import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { ConfigService } from '@nestjs/config';
import { ActivitiesService } from '../activities/activities.service';
import { BackendUsersService } from '../backend_users/backend_users.service';
import { BackendUser } from '../backend_users/entities/backend_user.entity';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: BackendUsersService,
    private readonly configService: ConfigService,
    private readonly activitiesService: ActivitiesService,
  ) {}

  async validateLogin(
    req: Request,
    email: string,
    password: string,
  ): Promise<{
    user: BackendUser;
    token: { access_token: string; expiration_date: string };
  }> {
    const user = await this.usersService.findOneByEmail(email, {
      role: {
        permissions: true,
      },
      permissions: true,
    });

    await this.checkPassword(user, password);

    const access_token = await this.createToken(user);

    const expiration_date = await this.configService.get('auth.expires');

    const token = { access_token, expiration_date };

    await this.activitiesService.createActivity(
      req.originalUrl,
      req.method,
      user.id,
    );

    return { user, token };
  }

  async createToken(user: BackendUser) {
    return this.jwtService.sign({
      id: user.id,
      email: user.email,
      locale: user.locale,
    });
  }

  async comparePassword(
    hashed_password: string,
    password: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashed_password);
  }

  async me(email: string): Promise<BackendUser> {
    return this.usersService.findOneByEmail(email, {
      role: {
        permissions: true,
      },
      permissions: true,
    });
  }

  async update(req: Request, email: string, userDto: AuthUpdateDto) {
    const user = await this.usersService.findOneByEmail(email);

    return await this.usersService.update(req, user.id, userDto, user.id);
  }

  async register(req: Request, createUserDto: AuthRegisterLoginDto) {
    await this.usersService.create(req, createUserDto, 0);

    return this.validateLogin(req, createUserDto.email, createUserDto.password);
  }

  async refresh(req: Request, email: string) {
    const user = await this.usersService.findOneByEmail(email);

    const access_token = await this.createToken(user);
    const expiration_date = await this.configService.get('auth.expires');
    const token = { access_token, expiration_date };

    await this.activitiesService.createActivity(
      req.originalUrl,
      req.method,
      user.id,
    );

    return {
      user,
      token,
    };
  }

  private async checkPassword(
    user: BackendUser,
    password: string,
  ): Promise<void> {
    const is_valid = await this.comparePassword(user.password, password);

    if (!is_valid) {
      throw new UnprocessableEntityException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          message: 'users.invalidPassword',
        },
      });
    }
  }
}
