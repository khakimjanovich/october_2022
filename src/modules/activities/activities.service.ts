import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { Repository } from 'typeorm';
import { CreateActivityDto } from './dto/create-activity.dto';
import { BackendUser } from '../backend_users/entities/backend_user.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async paginate(page_size: number, page: number) {
    const [data, count] = await this.activityRepository.findAndCount({
      relations: {
        user: true,
      },
      select: {
        id: true,
        original_url: true,
        method: true,
        before_update_action: {},
        after_update_action: {},
        created_at: true,
        user: {
          id: true,
          name: true,
          email: true,
        },
      },
      take: page_size,
      skip: (page - 1) * page_size,
      order: {
        id: 'desc',
      },
    });

    return {
      page,
      data,
      count,
      page_size,
    };
  }

  async create(createActivityDto: CreateActivityDto, current_user_id: number) {
    const activity = await this.activityRepository.create(createActivityDto);
    activity.user = { id: current_user_id } as BackendUser;

    return this.activityRepository.save(activity);
  }

  async createActivity(
    original_url: string,
    method: string,
    current_user_id: number,
    after_update_action: object = {},
    before_update_action: object = {},
  ) {
    return this.create(
      {
        original_url,
        method,
        after_update_action,
        before_update_action,
      },
      current_user_id,
    );
  }
}
