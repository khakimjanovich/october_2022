import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Activities')
@Controller({
  path: 'activities',
  version: '1',
})
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  async paginate(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('page_size', new DefaultValuePipe(10), ParseIntPipe)
    page_size: number,
    @Query('search', new DefaultValuePipe('')) search: string,
  ) {
    return this.activitiesService.paginate(page_size, page, search);
  }
}
