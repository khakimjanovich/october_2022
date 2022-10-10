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
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AbilityGuard } from '../ability/ability.guard';
import { CheckAbility } from '../ability/ability.decorator';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AbilityGuard)
@Controller({
  path: 'admin/permissions',
  version: '1',
})
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

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

  @CheckAbility({ action: 'index', subject: 'Permission' })
  @Get('/all')
  async all() {
    return { data: await this.permissionsService.all() };
  }
}
