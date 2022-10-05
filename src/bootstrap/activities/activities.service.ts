import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async paginate(page_size: number, page: number, search: string) {
    const [data, count] = await this.activityRepository
      .createQueryBuilder('activity')
      .where('activity.name LIKE :search', { search: `%${search}%` })
      .orderBy('activity.id', 'DESC')
      .take(page_size)
      .skip((page - 1) * page_size)
      .getManyAndCount();

    return {
      page,
      data,
      count,
      page_size,
    };
  }
}
