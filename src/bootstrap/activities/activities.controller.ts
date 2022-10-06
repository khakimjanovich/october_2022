import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ApiTags } from '@nestjs/swagger';
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
