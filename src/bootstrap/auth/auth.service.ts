import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async validateLogin(
    email: string,
    password: string,
  ): Promise<{
    user: User;
    token: { access_token: string; expiration_date: string };
  }> {
    const user = await this.usersService.findOneByEmail(email);

    await this.checkPassword(user, password);

    const access_token = await this.createToken(user);

    const expiration_date = await this.configService.get('auth.expires');

    const token = { access_token, expiration_date };

    return { user, token };
  }

  async createToken(user: User) {
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

  async me(email: string): Promise<User> {
    return this.usersService.findOneByEmail(email);
  }

  update(user: User, userDto: AuthUpdateDto) {
    return this.usersService.update(user.id, userDto, user.id);
  }

  async register(createUserDto: AuthRegisterLoginDto) {
    return this.usersService.create(createUserDto, 0);
  }

  private async checkPassword(user: User, password: string): Promise<void> {
    const is_valid = await this.comparePassword(user.password, password);

    if (!is_valid) {
      throw new UnprocessableEntityException({
        message: 'users.invalidPassword',
      });
    }
  }

  async refresh(email: string) {
    const user = await this.usersService.findOneByEmail(email);

    const access_token = await this.createToken(user);
    const expiration_date = await this.configService.get('auth.expires');
    const token = { access_token, expiration_date };

    return {
      user,
      token,
    };
  }
}
