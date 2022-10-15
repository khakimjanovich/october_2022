import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { AuthGuard } from '@nestjs/passport';
import { AbilityGuard } from '../ability/ability.guard';
import { CheckAbility } from '../ability/ability.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DeleteRoleDto } from './dto/delete-role.dto';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AbilityGuard)
@Controller({
  path: 'roles',
  version: '1',
})
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Get all roles endpoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        page: 1,
        data: [
          {
            id: 2,
            name: 'User',
          },
          {
            id: 1,
            name: 'Admin',
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
  @CheckAbility({ action: 'index', subject: 'Role' })
  @Get()
  async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('page_size', new DefaultValuePipe(10), ParseIntPipe)
    page_size: number,
  ) {
    const [data, count] = await this.rolesService.paginate(page, page_size);

    return {
      page,
      data,
      count,
      page_size,
    };
  }

  @ApiOperation({ summary: 'Get trashed roles list' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        data: [
          {
            deleted_reason: 'It has to be deleted',
            created_at: '2022-10-15T08:17:12.341Z',
            deleted_at: '2022-10-15T08:17:57.433Z',
            id: 3,
            name: 'BuperAdmin',
            deleted_by: {
              id: 1,
              name: 'Super admin updated',
              email: 'admin@example.com',
            },
            created_by: {
              id: 1,
              name: 'Super admin updated',
              email: 'admin@example.com',
            },
            last_update_by: {
              id: 1,
              name: 'Super admin updated',
              email: 'admin@example.com',
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
              {
                id: 6,
                action: 'trash',
                subject: 'File',
              },
            ],
          },
        ],
        count: 1,
        page: 1,
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
  @Get('/trash')
  @CheckAbility({ action: 'trash', subject: 'Role' })
  async trashed(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('page_size', new DefaultValuePipe(10), ParseIntPipe)
    page_size: number,
  ) {
    const [data, count] = await this.rolesService.trash(page, page_size);
    return { data, count, page, page_size };
  }

  @ApiOperation({ summary: 'Get role with permissions endpoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        data: {
          id: 1,
          name: 'Admin',
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
            {
              id: 6,
              action: 'trash',
              subject: 'File',
            },
            {
              id: 7,
              action: 'index',
              subject: 'Activity',
            },
            {
              id: 8,
              action: 'create',
              subject: 'Activity',
            },
            {
              id: 9,
              action: 'read',
              subject: 'Activity',
            },
            {
              id: 10,
              action: 'update',
              subject: 'Activity',
            },
            {
              id: 11,
              action: 'delete',
              subject: 'Activity',
            },
            {
              id: 12,
              action: 'trash',
              subject: 'Activity',
            },
            {
              id: 13,
              action: 'index',
              subject: 'Language',
            },
            {
              id: 14,
              action: 'create',
              subject: 'Language',
            },
            {
              id: 15,
              action: 'read',
              subject: 'Language',
            },
            {
              id: 16,
              action: 'update',
              subject: 'Language',
            },
            {
              id: 17,
              action: 'delete',
              subject: 'Language',
            },
            {
              id: 18,
              action: 'trash',
              subject: 'Language',
            },
            {
              id: 19,
              action: 'index',
              subject: 'Permission',
            },
            {
              id: 20,
              action: 'create',
              subject: 'Permission',
            },
            {
              id: 21,
              action: 'read',
              subject: 'Permission',
            },
            {
              id: 22,
              action: 'update',
              subject: 'Permission',
            },
            {
              id: 23,
              action: 'delete',
              subject: 'Permission',
            },
            {
              id: 24,
              action: 'trash',
              subject: 'Permission',
            },
            {
              id: 25,
              action: 'index',
              subject: 'Role',
            },
            {
              id: 26,
              action: 'create',
              subject: 'Role',
            },
            {
              id: 27,
              action: 'read',
              subject: 'Role',
            },
            {
              id: 28,
              action: 'update',
              subject: 'Role',
            },
            {
              id: 29,
              action: 'delete',
              subject: 'Role',
            },
            {
              id: 30,
              action: 'trash',
              subject: 'Role',
            },
            {
              id: 31,
              action: 'index',
              subject: 'BackendUser',
            },
            {
              id: 32,
              action: 'create',
              subject: 'BackendUser',
            },
            {
              id: 33,
              action: 'read',
              subject: 'BackendUser',
            },
            {
              id: 34,
              action: 'update',
              subject: 'BackendUser',
            },
            {
              id: 35,
              action: 'delete',
              subject: 'BackendUser',
            },
            {
              id: 36,
              action: 'trash',
              subject: 'BackendUser',
            },
          ],
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
  @CheckAbility({ action: 'read', subject: 'Role' })
  @Get(':id')
  async show(@Param('id') id: string) {
    return { data: await this.rolesService.findOne(+id) };
  }

  @ApiOperation({ summary: 'Create a role' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        data: {
          name: 'Superadmin',
          id: 3,
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
  @CheckAbility({ action: 'create', subject: 'Role' })
  @Post('/')
  async create(@Body() createRoleDto: CreateRoleDto, @Request() request) {
    return {
      data: await this.rolesService.create(createRoleDto, request.user.id),
    };
  }

  @ApiOperation({ summary: 'Update a role' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        data: {
          id: 3,
          name: 'BuperAdmin',
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
            {
              id: 6,
              action: 'trash',
              subject: 'File',
            },
          ],
        },
      },
    },
    description: 'Successful response',
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
  @CheckAbility({ action: 'update', subject: 'Role' })
  @Put(':id')
  async update(
    @Request() request,
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return {
      data: await this.rolesService.update(+id, updateRoleDto, request.user.id),
    };
  }

  @ApiOperation({ summary: 'Delete a role' })
  @Post(':id')
  async delete(
    @Request() request,
    @Param('id') id: string,
    @Body() deleteRoleDto: DeleteRoleDto,
  ) {
    return {
      data: await this.rolesService.remove(+id, deleteRoleDto, request.user.id),
    };
  }
}
