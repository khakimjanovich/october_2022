import { AuthService } from '../auth.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Auth')
@ApiBearerAuth()
@Controller({
  path: 'auth',
  version: '1',
})
export class RefreshController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Refresh token endpoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful response',
    schema: {
      example: {
        data: {
          user: {
            id: 6,
            locale: 'uz',
            created_at: '2022-10-13T12:13:03.329Z',
            updated_at: '2022-10-13T12:20:13.754Z',
            name: 'Super admin updated',
            email: 'adm2a131i2n3@admin.com',
            avatar:
              'http://localhost:3000/api/v1/files/43fc562a-c3ab-477b-8586-d65305116693.png',
            role: {
              id: 2,
              name: 'User',
            },
            permissions: [],
            all_permissions: [],
          },
          token: {
            access_token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG0yYTEzMWkybjNAYWRtaW4uY29tIiwibG9jYWxlIjoidXoiLCJpYXQiOjE2NjU2NjM2NjksImV4cCI6MTY2NTY3NDQ2OX0._68R3x4onW48ksM9_dz1tWM80H6HXz7pl_M-wQK3mwE',
            expiration_date: '3h',
          },
        },
      },
    },
  })
  @Post('refresh')
  async refresh(@Request() request) {
    return { data: await this.authService.refresh(request.user.email) };
  }
}
