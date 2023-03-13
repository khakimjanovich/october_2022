import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthRegisterLoginDto } from '../dto/auth-register-login.dto';
import { BackendUser } from '../../backend_users/entities/backend_user.entity';

@Controller({
  path: 'auth',
  version: '1',
})
export class RegisterController {
  constructor(public service: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Request() request,
    @Body() createUserDto: AuthRegisterLoginDto,
  ): Promise<{
    data: {
      token: { access_token: string; expiration_date: string };
      user: BackendUser;
    };
  }> {
    return { data: await this.service.register(request, createUserDto) };
  }
}
