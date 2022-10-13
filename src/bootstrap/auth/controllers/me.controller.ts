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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'admin/auth/me',
  version: '1',
})
export class MeController {
  constructor(public authService: AuthService) {}

  @ApiOperation({ summary: 'Get authenticated user endpoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful response',
    schema: {
      example: {
        data: {
          id: 3,
          first_name: 'John',
          last_name: 'Doe',
          email: 'test1@example.com',
          avatar: null,
          locale: 'uz',
          created_at: '2022-09-09T09:29:15.046Z',
          updated_at: '2022-09-09T09:29:15.046Z',
          role: {
            id: 2,
            name: 'User',
            __entity: 'Role',
          },
          status: {
            id: 1,
            name: 'Active',
            __entity: 'UserStatus',
          },
          __entity: 'User',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized response',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async me(@Request() request) {
    const user = await this.authService.me(request.user.email);

    delete user.password;
    delete user.role?.permissions;
    delete user.previousPassword;
    delete user.deleted_at;
    delete user.deleted_reason;

    return { data: user };
  }

  @ApiOperation({ summary: 'Update current user endpoint' })
  @Patch('/')
  @HttpCode(HttpStatus.OK)
  public async update(@Request() request, @Body() userDto: AuthUpdateDto) {
    return this.authService.update(request.user.email, userDto);
  }
}
