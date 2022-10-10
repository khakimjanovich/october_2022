import { AuthService } from '../auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Auth')
@Controller({
  path: 'admin/auth',
  version: '1',
})
export class RefreshController {
  constructor(private readonly authService: AuthService) {}

  @Post('refresh')
  async refresh(@Request() request) {
    return { data: await this.authService.refresh(request.user.email) };
  }
}
