import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AbilityGuard } from '../ability/ability.guard';
import { CheckAbility } from '../ability/ability.decorator';

@ApiTags('Permissions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AbilityGuard)
@Controller({
  path: 'admin/permissions',
  version: '1',
})
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @ApiOperation({ summary: 'Get paginated permissions endpoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        page: 1,
        data: [
          {
            id: 31,
            action: 'index',
            subject: 'BackendUser',
          },
          {
            id: 25,
            action: 'index',
            subject: 'Role',
          },
          {
            id: 19,
            action: 'index',
            subject: 'Permission',
          },
          {
            id: 13,
            action: 'index',
            subject: 'Language',
          },
          {
            id: 7,
            action: 'index',
            subject: 'Activity',
          },
          {
            id: 1,
            action: 'index',
            subject: 'File',
          },
        ],
        count: 6,
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
  @CheckAbility({ action: 'index', subject: 'Permission' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('page_size', new DefaultValuePipe(10), ParseIntPipe)
    page_size: number,
    @Query('search') search?: string,
  ) {
    const [data, count] = await this.permissionsService.paginate({
      page,
      page_size,
      search,
    });

    return {
      page,
      data,
      count,
      page_size,
    };
  }

  @ApiOperation({ summary: 'Get all permissions endpoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        data: [
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
  @CheckAbility({ action: 'index', subject: 'Permission' })
  @Get('/all')
  async all() {
    return { data: await this.permissionsService.all() };
  }
}
