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
import { CreateActivityDto } from '../activities/dto/create-activity.dto';
import { ActivitiesRouteTypeEnum } from '../activities/activities-route-type.enum';
import { BackendUsersService } from '../backend_users/backend_users.service';
import { BackendUser } from '../backend_users/entities/backend_user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: BackendUsersService,
    private readonly configService: ConfigService,
    private readonly activitiesService: ActivitiesService,
  ) {}

  async validateLogin(
    email: string,
    password: string,
  ): Promise<{
    user: BackendUser;
    token: { access_token: string; expiration_date: string };
  }> {
    const user = await this.usersService.findOneByEmail(email);

    await this.checkPassword(user, password);

    const access_token = await this.createToken(user);

    const expiration_date = await this.configService.get('auth.expires');

    const token = { access_token, expiration_date };

    await this.activitiesService.create(
      {
        name: `${user.name} logged in`,
        route: '/api/v1/admin/auth/login',
        request_type: ActivitiesRouteTypeEnum.post,
      } as CreateActivityDto,
      user.id,
    );

    delete user.password;
    delete user.deleted_reason;
    delete user.deleted_at;
    delete user.role?.permissions;
    delete user.previousPassword;

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
    return this.usersService.findOneByEmail(email);
  }

  async update(email: string, userDto: AuthUpdateDto) {
    const user = await this.usersService.findOneByEmail(email);

    await this.activitiesService.create(
      {
        name: `${user.name} updated profile`,
        route: '/api/v1/admin/auth/me',
        request_type: ActivitiesRouteTypeEnum.patch,
        before_update_action: user,
        after_update_action: userDto,
      } as CreateActivityDto,
      user.id,
    );
    const backend_user = await this.usersService.update(
      user.id,
      userDto,
      user.id,
    );

    delete backend_user.password;
    delete backend_user.deleted_reason;
    delete backend_user.deleted_at;
    delete backend_user.role?.permissions;
    delete backend_user.previousPassword;

    return backend_user;
  }

  async register(createUserDto: AuthRegisterLoginDto) {
    const user = await this.usersService.create(createUserDto, 0);

    await this.activitiesService.create(
      {
        name: `${user.name} registered`,
        route: '/api/v1/admin/auth/register',
        request_type: ActivitiesRouteTypeEnum.post,
      } as CreateActivityDto,
      user.id,
    );

    return this.validateLogin(createUserDto.email, createUserDto.password);
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

  async refresh(email: string) {
    const user = await this.usersService.findOneByEmail(email);

    const access_token = await this.createToken(user);
    const expiration_date = await this.configService.get('auth.expires');
    const token = { access_token, expiration_date };

    await this.activitiesService.create(
      {
        name: `${user.name} refreshed auth token!`,
        route: '/api/v1/admin/auth/refresh',
        request_type: ActivitiesRouteTypeEnum.post,
      } as CreateActivityDto,
      user.id,
    );
    delete user.password;
    delete user.deleted_reason;
    delete user.deleted_at;
    delete user.role?.permissions;
    delete user.previousPassword;

    return {
      user,
      token,
    };
  }
}
