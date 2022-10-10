import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { ConfigService } from '@nestjs/config';
import { ActivitiesService } from '../../bootstrap/activities/activities.service';
import { ActivitiesRouteTypeEnum } from '../../bootstrap/activities/activities-route-type.enum';
import { CreateActivityDto } from '../../bootstrap/activities/dto/create-activity.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly activitiesService: ActivitiesService,
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

    await this.activitiesService.create(
      {
        name: `${user.name} has logged in`,
        route: '/api/v1/admin/auth/login',
        request_type: ActivitiesRouteTypeEnum.post,
      } as CreateActivityDto,
      user.id,
    );

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

  async update(email: string, userDto: AuthUpdateDto) {
    const user = await this.usersService.findOneByEmail(email);

    await this.activitiesService.create(
      {
        name: `${user.name} has updated profile`,
        route: '/api/v1/admin/auth/me',
        request_type: ActivitiesRouteTypeEnum.patch,
        before_update_action: user,
        after_update_action: userDto,
      } as CreateActivityDto,
      user.id,
    );

    return this.usersService.update(user.id, userDto, user.id);
  }

  async register(createUserDto: AuthRegisterLoginDto) {
    const user = await this.usersService.create(createUserDto, 0);

    await this.activitiesService.create(
      {
        name: `${user.name} has registered`,
        route: '/api/v1/admin/auth/register',
        request_type: ActivitiesRouteTypeEnum.post,
      } as CreateActivityDto,
      user.id,
    );
    return this.validateLogin(createUserDto.email, createUserDto.password);
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
