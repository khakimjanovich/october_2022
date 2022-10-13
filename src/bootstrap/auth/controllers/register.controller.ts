import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthRegisterLoginDto } from '../dto/auth-register-login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BackendUser } from '../../backend_users/entities/backend_user.entity';

@ApiTags('Auth')
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
          user: {
            id: 6,
            locale: 'ru',
            created_at: '2022-10-13T12:13:03.329Z',
            updated_at: '2022-10-13T12:13:03.329Z',
            name: 'admin',
            email: 'adm2a131i2n3@admin.com',
            avatar: null,
            role: {
              id: 2,
              name: 'User',
            },
            permissions: [],
            all_permissions: [],
          },
          token: {
            access_token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG0yYTEzMWkybjNAYWRtaW4uY29tIiwibG9jYWxlIjoicnUiLCJpYXQiOjE2NjU2NjMxODMsImV4cCI6MTY2NTY3Mzk4M30.-o2mX8IntdW9HpxmzJRkFLcFYzWxZBsbCLTFJ8SwX5k',
            expiration_date: '3h',
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
  async register(@Body() createUserDto: AuthRegisterLoginDto): Promise<{
    data: {
      token: { access_token: string; expiration_date: string };
      user: BackendUser;
    };
  }> {
    return { data: await this.service.register(createUserDto) };
  }
}
