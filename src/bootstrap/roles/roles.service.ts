import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly permissionsService: PermissionsService,
  ) {}

  paginate(page: number, page_size: number) {
    return this.roleRepository
      .createQueryBuilder('role')
      .take(page_size)
      .select(['role.id', 'role.name'])
      .skip(page_size * (page - 1))
      .getManyAndCount();
  }

  findOne(id: number) {
    return this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
  }

  async create(createRoleDto: CreateRoleDto) {
    const role = await this.roleRepository.create({ name: createRoleDto.name });
    return await this.roleRepository.save(role);
  }
}
