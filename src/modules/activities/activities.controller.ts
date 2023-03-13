import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';

import { AuthGuard } from '@nestjs/passport';
import { AbilityGuard } from '../../utils/ability/ability.guard';
import { CheckAbility } from '../../utils/ability/ability.decorator';

@UseGuards(AuthGuard('jwt'), AbilityGuard)
@Controller({
  path: 'activities',
  version: '1',
})
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @CheckAbility({ action: 'index', subject: 'Activity' })
  @Get()
  async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('page_size', new DefaultValuePipe(10), ParseIntPipe)
    page_size: number,
  ) {
    return this.activitiesService.paginate(page_size, page);
  }
}
