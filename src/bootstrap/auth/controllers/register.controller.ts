import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthRegisterLoginDto } from '../dto/auth-register-login.dto';
import { User } from '../../users/entities/user.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

ApiTags('Auth');
@Controller({
  path: 'auth',
  version: '1',
})
export class RegisterController {
  constructor(public service: AuthService) {}

  @ApiOperation({ summary: 'Register endpoint' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully created!',
    schema: {
      example: {
        data: {
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6eyJpZCI6MiwibmFtZSI6IlVzZXIiLCJfX2VudGl0eSI6IlJvbGUifSwiZW1haWwiOiJ0ZXN0MUBleGFtcGxlLmNvbSIsImxvY2FsZSI6InV6IiwiaWF0IjoxNjYyNzE1NzU1LCJleHAiOjE2NjI4MDIxNTV9.QkgKatQGtLbFgLsuYQLaCqXaaMXhj8LT0S8oIQeFu0U',
          user: {
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
    },
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Email already exists!',
    schema: {
      example: {
        status: 422,
        errors: {
          email: 'emailAlreadyExists',
        },
      },
    },
  })
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() createUserDto: AuthRegisterLoginDto,
  ): Promise<{ data: User }> {
    return { data: await this.service.register(createUserDto) };
  }
}
