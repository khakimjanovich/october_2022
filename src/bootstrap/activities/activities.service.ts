import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { Repository } from 'typeorm';
import { CreateActivityDto } from './dto/create-activity.dto';
import { User } from '../users/entities/user.entity';

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
      .leftJoinAndSelect('activity.user', 'user')
      .select([
        'activity.id',
        'activity.name',
        'activity.route',
        'activity.created_at',
        'activity.before_update_action',
        'activity.after_update_action',
        'user.id',
        'user.name',
        'user.email',
      ])
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

  async create(createActivityDto: CreateActivityDto, current_user_id: number) {
    const activity = await this.activityRepository.create(createActivityDto);
    activity.user = { id: current_user_id } as User;

    return this.activityRepository.save(activity);
  }
}
