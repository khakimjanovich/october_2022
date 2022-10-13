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
  path: 'auth/me',
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
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized response',
    schema: {
      example: {
        statusCode: HttpStatus.UNAUTHORIZED,
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful response',
    schema: {
      example: {
        id: 6,
        locale: 'uz',
        created_at: '2022-10-13T12:13:03.329Z',
        updated_at: '2022-10-13T12:17:12.635Z',
        name: 'Super admin updated',
        email: 'adm2a131i2n3@admin.com',
        role: {
          id: 2,
          name: 'User',
        },
        created_by: null,
        last_update_by: {
          id: 6,
        },
        permissions: [],
        avatar:
          'http://localhost:3000/api/v1/files/43fc562a-c3ab-477b-8586-d65305116693.png',
      },
    },
  })
  @Patch('/')
  @HttpCode(HttpStatus.OK)
  public async update(@Request() request, @Body() userDto: AuthUpdateDto) {
    return { data: await this.authService.update(request.user.email, userDto) };
  }
}
