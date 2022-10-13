import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthEmailLoginDto } from '../dto/auth-email-login.dto';
import { BackendUser } from '../../backend_users/entities/backend_user.entity';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class LoginController {
  constructor(public service: AuthService) {}

  @ApiOperation({ summary: 'Login endpoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        data: {
          user: {
            id: 1,
            locale: 'uz',
            created_at: '2022-10-13T11:24:26.965Z',
            updated_at: '2022-10-13T11:44:42.083Z',
            name: 'Super admin updated',
            email: 'admin@example.com',
            avatar:
              'http://localhost:3000/api/v1/files/43fc562a-c3ab-477b-8586-d65305116693.png',
            role: {
              id: 1,
              name: 'Admin',
            },
            permissions: [],
            all_permissions: [
              'File.index',
              'File.create',
              'File.read',
              'File.update',
              'File.delete',
              'File.trash',
              'Activity.index',
              'Activity.create',
              'Activity.read',
              'Activity.update',
              'Activity.delete',
              'Activity.trash',
              'Language.index',
              'Language.create',
              'Language.read',
              'Language.update',
              'Language.delete',
              'Language.trash',
              'Permission.index',
              'Permission.create',
              'Permission.read',
              'Permission.update',
              'Permission.delete',
              'Permission.trash',
              'Role.index',
              'Role.create',
              'Role.read',
              'Role.update',
              'Role.delete',
              'Role.trash',
              'BackendUser.index',
              'BackendUser.create',
              'BackendUser.read',
              'BackendUser.update',
              'BackendUser.delete',
              'BackendUser.trash',
            ],
          },
          token: {
            access_token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsImxvY2FsZSI6InV6IiwiaWF0IjoxNjY1NjYxOTA5LCJleHAiOjE2NjU2NzI3MDl9.6q7KVEHFON24oNwMsxzdVpUJ-46j-kokunZwSpUzEjc',
            expiration_date: '3h',
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
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'users.invalidPassword',
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
