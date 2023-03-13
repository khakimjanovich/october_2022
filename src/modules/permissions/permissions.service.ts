import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { In, Like, Repository } from 'typeorm';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async paginate(query: { search: string; page: number; page_size: number }) {
    const page: number = +query.page || 1;
    const page_size: number = +query.page_size || 10;
    const search: string = query.search || '';

    return await this.permissionsRepository.findAndCount({
      order: {
        id: 'DESC',
      },
      where: search
        ? [{ subject: Like(`%${search}%`) }, { action: Like(`%${search}%`) }]
        : {},
      skip: (page - 1) * page_size,
      take: page_size,
    });
  }

  async findByIds(ids: number[]) {
    return this.permissionsRepository.findBy({ id: In(ids) });
  }

  all() {
    return this.permissionsRepository.find();
  }
}
