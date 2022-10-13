import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CheckAbility } from '../ability/ability.decorator';
import { AbilityGuard } from '../ability/ability.guard';

@UseGuards(AuthGuard('jwt'), AbilityGuard)
@ApiTags('Activities')
@Controller({
  path: 'activities',
  version: '1',
})
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @ApiOperation({ summary: 'Activities endpoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        page: 1,
        data: [
          {
            id: 36,
            name: 'Super admin updated logged in',
            route: '/api/v1/admin/auth/login',
            before_update_action: null,
            after_update_action: null,
            created_at: '2022-10-13T12:24:26.485Z',
            user: {
              id: 1,
              name: 'Super admin updated',
              email: 'admin@example.com',
            },
          },
          {
            id: 35,
            name: 'Super admin updated refreshed auth token!',
            route: '/api/v1/admin/auth/refresh',
            before_update_action: null,
            after_update_action: null,
            created_at: '2022-10-13T12:21:31.349Z',
            user: {
              id: 6,
              name: 'Super admin updated',
              email: 'adm2a131i2n3@admin.com',
            },
          },
          {
            id: 34,
            name: 'Super admin updated refreshed auth token!',
            route: '/api/v1/admin/auth/refresh',
            before_update_action: null,
            after_update_action: null,
            created_at: '2022-10-13T12:21:30.935Z',
            user: {
              id: 6,
              name: 'Super admin updated',
              email: 'adm2a131i2n3@admin.com',
            },
          },
          {
            id: 33,
            name: 'Super admin updated refreshed auth token!',
            route: '/api/v1/admin/auth/refresh',
            before_update_action: null,
            after_update_action: null,
            created_at: '2022-10-13T12:21:30.575Z',
            user: {
              id: 6,
              name: 'Super admin updated',
              email: 'adm2a131i2n3@admin.com',
            },
          },
          {
            id: 32,
            name: 'Super admin updated refreshed auth token!',
            route: '/api/v1/admin/auth/refresh',
            before_update_action: null,
            after_update_action: null,
            created_at: '2022-10-13T12:21:09.473Z',
            user: {
              id: 6,
              name: 'Super admin updated',
              email: 'adm2a131i2n3@admin.com',
            },
          },
          {
            id: 31,
            name: 'Super admin updated refreshed auth token!',
            route: '/api/v1/admin/auth/refresh',
            before_update_action: null,
            after_update_action: null,
            created_at: '2022-10-13T12:21:08.815Z',
            user: {
              id: 6,
              name: 'Super admin updated',
              email: 'adm2a131i2n3@admin.com',
            },
          },
          {
            id: 30,
            name: 'Super admin updated refreshed auth token!',
            route: '/api/v1/admin/auth/refresh',
            before_update_action: null,
            after_update_action: null,
            created_at: '2022-10-13T12:21:02.770Z',
            user: {
              id: 6,
              name: 'Super admin updated',
              email: 'adm2a131i2n3@admin.com',
            },
          },
          {
            id: 29,
            name: 'Super admin updated updated profile',
            route: '/api/v1/admin/auth/me',
            before_update_action: {
              locale: 'uz',
              name: 'Super admin updated',
              avatar:
                'http://localhost:3000/api/v1/files/43fc562a-c3ab-477b-8586-d65305116693.png',
            },
            after_update_action: {
              locale: 'uz',
              name: 'Super admin updated',
              avatar:
                'http://localhost:3000/api/v1/files/43fc562a-c3ab-477b-8586-d65305116693.png',
            },
            created_at: '2022-10-13T12:20:13.743Z',
            user: {
              id: 6,
              name: 'Super admin updated',
              email: 'adm2a131i2n3@admin.com',
            },
          },
          {
            id: 28,
            name: 'Super admin updated updated profile',
            route: '/api/v1/admin/auth/me',
            before_update_action: {
              locale: 'uz',
              name: 'Super admin updated',
              avatar:
                'http://localhost:3000/api/v1/files/43fc562a-c3ab-477b-8586-d65305116693.png',
            },
            after_update_action: {
              locale: 'uz',
              name: 'Super admin updated',
              avatar:
                'http://localhost:3000/api/v1/files/43fc562a-c3ab-477b-8586-d65305116693.png',
            },
            created_at: '2022-10-13T12:20:12.934Z',
            user: {
              id: 6,
              name: 'Super admin updated',
              email: 'adm2a131i2n3@admin.com',
            },
          },
          {
            id: 27,
            name: 'Super admin updated updated profile',
            route: '/api/v1/admin/auth/me',
            before_update_action: {
              locale: 'uz',
              name: 'Super admin updated',
              avatar:
                'http://localhost:3000/api/v1/files/43fc562a-c3ab-477b-8586-d65305116693.png',
            },
            after_update_action: {
              locale: 'uz',
              name: 'Super admin updated',
              avatar:
                'http://localhost:3000/api/v1/files/43fc562a-c3ab-477b-8586-d65305116693.png',
            },
            created_at: '2022-10-13T12:19:36.230Z',
            user: {
              id: 6,
              name: 'Super admin updated',
              email: 'adm2a131i2n3@admin.com',
            },
          },
        ],
        count: 36,
        page_size: 10,
      },
    },
    description: 'Successfully logged in!',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    schema: {
      example: {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
  })
  @CheckAbility({ action: 'index', subject: 'Activity' })
  @Get()
  async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('page_size', new DefaultValuePipe(10), ParseIntPipe)
    page_size: number,
    @Query('search', new DefaultValuePipe('')) search: string,
  ) {
    return this.activitiesService.paginate(page_size, page, search);
  }
}
