import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { AuthUpdateDto } from '../dto/auth-update.dto';

@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'auth/me',
  version: '1',
})
export class MeController {
  constructor(public authService: AuthService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async me(@Request() request) {
    const user = await this.authService.me(request.user.email);

    return { data: user };
  }

  @Patch('/')
  @HttpCode(HttpStatus.OK)
  public async update(@Request() request, @Body() userDto: AuthUpdateDto) {
    return {
      data: await this.authService.update(request, request.user.email, userDto),
    };
  }
}
