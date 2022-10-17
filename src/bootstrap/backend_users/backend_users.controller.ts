import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BackendUsersService } from './backend_users.service';
import { CreateBackendUserDto } from './dto/create-backend_user.dto';
import { UpdateBackendUserDto } from './dto/update-backend_user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteBackendUserDto } from './dto/delete-backend_user.dto';
import { BackendUser } from './entities/backend_user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UpdateBackendUserPermissionsDto } from './dto/update-backend_user-permissions.dto';
import { CheckAbility } from '../ability/ability.decorator';
import { AbilityGuard } from '../ability/ability.guard';

@UseGuards(AuthGuard('jwt'), AbilityGuard)
@ApiTags('Backend Users')
@ApiBearerAuth()
@Controller({
  path: 'backend-users',
  version: '1',
})
export class BackendUsersController {
  constructor(private readonly usersService: BackendUsersService) {}

  @ApiOperation({ summary: 'Create backend user endpoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        data: {
          locale: 'uz',
          name: 'John Doe',
          email: 'em2aai21332l31122211@email.com',
          password:
            '$2a$10$uBK9ZELLSUV8fuicGieie..NJXs./WFKXBAJZ7Tdm1lVJF8JX61kG',
          role: 2,
          created_by: {
            id: 1,
          },
          last_updated_by: {
            id: 1,
          },
          deleted_reason: null,
          deleted_at: null,
          avatar: null,
          id: 8,
          created_at: '2022-10-13T12:30:38.527Z',
          updated_at: '2022-10-13T12:30:38.527Z',
        },
      },
    },
    description: 'Successfully created user!',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
    description: 'Forbidden response!',
  })
  @CheckAbility({ action: 'create', subject: 'BackendUser' })
  @Post()
  async create(
    @Body() createUserDto: CreateBackendUserDto,
    @Request() request,
  ): Promise<{ data: BackendUser }> {
    return {
      data: await this.usersService.create(createUserDto, request.user.id),
    };
  }

  @ApiOperation({ summary: 'Get list of backend users endpoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        page: 1,
        data: [
          {
            id: 9,
            locale: 'ru',
            created_at: '2022-10-13T12:30:56.915Z',
            name: 'admin',
            email: 'adm2a1312i22n3@admin.com',
            role: {
              id: 2,
              name: 'User',
            },
            created_by: null,
            last_updated_by: null,
          },
          {
            id: 8,
            locale: 'uz',
            created_at: '2022-10-13T12:30:38.527Z',
            name: 'John Doe',
            email: 'em2aai21332l31122211@email.com',
            role: {
              id: 2,
              name: 'User',
            },
            created_by: {
              id: 1,
              name: 'Super admin updated',
              email: 'admin@example.com',
            },
            last_updated_by: {
              id: 1,
              name: 'Super admin updated',
              email: 'admin@example.com',
            },
          },
          {
            id: 7,
            locale: 'ru',
            created_at: '2022-10-13T12:26:49.848Z',
            name: 'admin',
            email: 'adm2a131i22n3@admin.com',
            role: {
              id: 2,
              name: 'User',
            },
            created_by: null,
            last_updated_by: null,
          },
          {
            id: 6,
            locale: 'uz',
            created_at: '2022-10-13T12:13:03.329Z',
            name: 'Super admin updated',
            email: 'adm2a131i2n3@admin.com',
            role: {
              id: 2,
              name: 'User',
            },
            created_by: null,
            last_updated_by: {
              id: 6,
              name: 'Super admin updated',
              email: 'adm2a131i2n3@admin.com',
            },
          },
          {
            id: 5,
            locale: 'ru',
            created_at: '2022-10-13T12:06:54.583Z',
            name: 'admin',
            email: 'adm2a11i2n3@admin.com',
            role: {
              id: 2,
              name: 'User',
            },
            created_by: null,
            last_updated_by: null,
          },
          {
            id: 2,
            locale: 'en',
            created_at: '2022-10-13T11:24:27.047Z',
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: {
              id: 2,
              name: 'User',
            },
            created_by: null,
            last_updated_by: null,
          },
          {
            id: 1,
            locale: 'uz',
            created_at: '2022-10-13T11:24:26.965Z',
            name: 'Super admin updated',
            email: 'admin@example.com',
            role: {
              id: 1,
              name: 'Admin',
            },
            created_by: null,
            last_updated_by: {
              id: 1,
              name: 'Super admin updated',
              email: 'admin@example.com',
            },
          },
        ],
        count: 7,
        page_size: 10,
      },
    },
    description: 'Successful response!',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
    description: 'Forbidden response!',
  })
  @CheckAbility({ action: 'index', subject: 'BackendUser' })
  @Get()
  async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('page_size', new DefaultValuePipe(10), ParseIntPipe)
    page_size: number,
    @Query('search', new DefaultValuePipe('')) search: string,
  ) {
    const [data, count] = await this.usersService.paginate(
      page_size,
      page,
      search,
    );
    return {
      page,
      data,
      count,
      page_size,
    };
  }

  @ApiOperation({ summary: 'Get list of trashed backend users endpoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        page: 1,
        data: [
          {
            id: 4,
            locale: 'uz',
            deleted_reason: 'Lang was incorrect temporarilily',
            created_at: '2022-10-13T11:46:48.195Z',
            deleted_at: '2022-10-13T11:46:59.694Z',
            name: 'John Doe',
            email: 'em2aai21332l31122211@email.com',
            role: {
              id: 2,
              name: 'User',
            },
            created_by: {
              name: 'Super admin updated',
              email: 'admin@example.com',
            },
            last_updated_by: {
              name: 'Super admin updated',
              email: 'admin@example.com',
            },
            deleted_by: {
              name: 'Super admin updated',
              email: 'admin@example.com',
            },
          },
          {
            id: 3,
            locale: 'ru',
            deleted_reason: 'Lang was incorrect temporarilily',
            created_at: '2022-10-13T11:45:19.091Z',
            deleted_at: '2022-10-13T11:46:37.307Z',
            name: 'admin',
            email: 'adm2a11i2n3@admin.com',
            role: {
              id: 2,
              name: 'User',
            },
            created_by: null,
            last_updated_by: null,
            deleted_by: {
              name: 'Super admin updated',
              email: 'admin@example.com',
            },
          },
        ],
        count: 2,
        page_size: 10,
      },
    },
    description: 'Successful response!',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
    description: 'Forbidden response!',
  })
  @CheckAbility({ action: 'trash', subject: 'BackendUser' })
  @Get('trash')
  async trash(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('page_size', new DefaultValuePipe(10), ParseIntPipe)
    page_size: number,
    @Query('search', new DefaultValuePipe('')) search: string,
  ) {
    const [data, count] = await this.usersService.trash(
      page_size,
      page,
      search,
    );

    return {
      page,
      data,
      count,
      page_size,
    };
  }

  @ApiOperation({ summary: 'Get an entity of backend users endpoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        data: {
          id: 1,
          locale: 'uz',
          created_at: '2022-10-13T11:24:26.965Z',
          updated_at: '2022-10-13T11:44:42.083Z',
          name: 'Super admin updated',
          email: 'admin@example.com',
          role: {
            id: 1,
            name: 'Admin',
          },
          created_by: null,
          last_updated_by: {
            id: 1,
            name: 'Super admin updated',
            email: 'admin@example.com',
          },
          permissions: [],
        },
      },
    },
    description: 'Successful response!',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
    description: 'Forbidden response!',
  })
  @CheckAbility({ action: 'read', subject: 'BackendUser' })
  @Get(':id')
  async show(@Param('id') id: string) {
    return { data: await this.usersService.findOne(+id) };
  }

  @ApiOperation({ summary: 'Update an entity of backend users endpoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        data: {
          id: 1,
          locale: 'uz',
          created_at: '2022-10-13T11:24:26.965Z',
          updated_at: '2022-10-13T11:44:42.083Z',
          name: 'Super admin updated',
          email: 'admin@example.com',
          role: {
            id: 1,
            name: 'Admin',
          },
          created_by: null,
          last_updated_by: {
            id: 1,
            name: 'Super admin updated',
            email: 'admin@example.com',
          },
          permissions: [],
        },
      },
    },
    description: 'Successful response!',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
    description: 'Forbidden response!',
  })
  @CheckAbility({ action: 'update', subject: 'BackendUser' })
  @Patch(':id')
  async update(
    @Request() request,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateBackendUserDto,
  ) {
    return {
      data: await this.usersService.update(+id, updateUserDto, request.user.id),
    };
  }

  @ApiOperation({
    summary: 'Update an entity of backend users` permissions endpoint',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        data: {
          id: 3,
          locale: 'en',
          created_at: '2022-10-13T13:28:28.239Z',
          updated_at: '2022-10-13T16:09:37.456Z',
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: {
            id: 2,
            name: 'User',
          },
          created_by: null,
          last_updated_by: {
            id: 1,
          },
          permissions: [
            {
              id: 1,
              action: 'index',
              subject: 'File',
            },
            {
              id: 2,
              action: 'create',
              subject: 'File',
            },
            {
              id: 3,
              action: 'read',
              subject: 'File',
            },
            {
              id: 4,
              action: 'update',
              subject: 'File',
            },
            {
              id: 5,
              action: 'delete',
              subject: 'File',
            },
          ],
          deleted_reason: null,
          deleted_at: null,
          avatar: null,
        },
      },
    },
    description: 'Successful response!',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
    description: 'Forbidden response!',
  })
  @CheckAbility({ action: 'update', subject: 'BackendUser' })
  @Post(':id/permissions')
  async updatePermissions(
    @Request() request,
    @Param('id') id: string,
    @Body() updateUserPermissionsDto: UpdateBackendUserPermissionsDto,
  ) {
    return {
      data: await this.usersService.updatePermissions(
        +id,
        updateUserPermissionsDto,
        request.user.id,
      ),
    };
  }

  @ApiOperation({
    summary: 'Delete an entity of backend users endpoint',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        data: {
          id: 8,
          locale: 'uz',
          created_at: '2022-10-13T12:30:38.527Z',
          updated_at: '2022-10-13T12:51:55.783Z',
          name: 'John Doe',
          email: 'em2aai21332l31122211@email.com',
          role: {
            id: 2,
            name: 'User',
          },
          created_by: {
            id: 1,
            name: 'Super admin updated',
            email: 'admin@example.com',
          },
          last_updated_by: {
            id: 1,
            name: 'Super admin updated',
            email: 'admin@example.com',
          },
          permissions: [],
          deleted_reason: 'Lang was incorrect temporarilily',
          deleted_by: {
            id: 1,
            locale: 'uz',
            created_at: '2022-10-13T11:24:26.965Z',
            updated_at: '2022-10-13T11:44:42.083Z',
            name: 'Super admin updated',
            email: 'admin@example.com',
            role: {
              id: 1,
              name: 'Admin',
            },
            created_by: null,
            last_updated_by: {
              id: 1,
              name: 'Super admin updated',
              email: 'admin@example.com',
            },
            permissions: [],
          },
          deleted_at: null,
          avatar: null,
        },
      },
    },
    description: 'Successful response!',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
    description: 'Forbidden response!',
  })
  @CheckAbility({ action: 'delete', subject: 'BackendUser' })
  @Post(':id')
  async delete(
    @Request() request,
    @Param('id') id: string,
    @Body() deleteUserDto: DeleteBackendUserDto,
  ) {
    return {
      data: await this.usersService.remove(+id, deleteUserDto, request.user.id),
    };
  }
}
