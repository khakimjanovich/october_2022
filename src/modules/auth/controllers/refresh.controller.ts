import { AuthService } from '../auth.service';
import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'auth',
  version: '1',
})
export class RefreshController {
  constructor(private readonly authService: AuthService) {}

  @Post('refresh')
  async refresh(@Request() request) {
    return {
      data: await this.authService.refresh(request, request.user.email),
    };
  }
}
