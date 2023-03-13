import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthEmailLoginDto } from '../dto/auth-email-login.dto';
import { BackendUser } from '../../backend_users/entities/backend_user.entity';

@Controller({
  path: 'auth',
  version: '1',
})
export class LoginController {
  constructor(public service: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Request() request,
    @Body() loginDto: AuthEmailLoginDto,
  ): Promise<{
    data: {
      token: { access_token: string; expiration_date: string };
      user: BackendUser;
    };
  }> {
    return {
      data: await this.service.validateLogin(
        request,
        loginDto.email,
        loginDto.password,
      ),
    };
  }
}
