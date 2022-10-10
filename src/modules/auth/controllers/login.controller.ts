import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthEmailLoginDto } from '../dto/auth-email-login.dto';
import { BackendUser } from '../../backend_users/entities/backend_user.entity';

@ApiTags('Auth')
@Controller({
  path: 'admin/auth',
  version: '1',
})
export class LoginController {
  constructor(public service: AuthService) {}

  @ApiOperation({ summary: 'Login endpoint' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        data: {
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6eyJpZCI6MSwibmFtZSI6IkFkbWluIiwiX19lbnRpdHkiOiJSb2xlIn0sImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJsb2NhbGUiOiJlbiIsImlhdCI6MTY2MjcxNDk3NiwiZXhwIjoxNjYyODAxMzc2fQ.xyAq4_L5Kt3dARAjlrW8aEr-4JtaBg98O7xT4I7T2YU',
          user: {
            id: 1,
            first_name: 'Admin updated',
            last_name: 'Admin',
            email: 'admin@example.com',
            avatar:
              'http://localhost:3000/api/v1/files/43fc562a-c3ab-477b-8586-d65305116693.png',
            locale: 'en',
            created_at: '2022-09-07T09:29:18.134Z',
            updated_at: '2022-09-08T05:41:56.749Z',
            role: {
              id: 1,
              name: 'Admin',
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
    },
    description: 'Successfully logged in!',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    schema: {
      example: {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'incorrectPassword',
        },
      },
    },
  })
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: AuthEmailLoginDto): Promise<{
    data: {
      token: { access_token: string; expiration_date: string };
      user: BackendUser;
    };
  }> {
    return {
      data: await this.service.validateLogin(loginDto.email, loginDto.password),
    };
  }
}
