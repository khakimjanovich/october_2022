import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { AuthGuard } from '@nestjs/passport';
import { AbilityGuard } from '../ability/ability.guard';
import { CheckAbility } from '../ability/ability.decorator';

@UseGuards(AuthGuard('jwt'), AbilityGuard)
@Controller({
  path: 'roles',
  version: '1',
})
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @CheckAbility({ action: 'index', subject: 'Role' })
  @Get()
  async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('page_size', new DefaultValuePipe(10), ParseIntPipe)
    page_size: number,
    @Query('search', new DefaultValuePipe('')) search: string,
  ) {
    const [data, count] = await this.rolesService.paginate(page, page_size);

    return {
      page,
      data,
      count,
      page_size,
    };
  }

  @CheckAbility({ action: 'read', subject: 'Role' })
  @Get(':id')
  show(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }
}
