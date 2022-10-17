import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { PermissionsService } from '../permissions/permissions.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ActivitiesService } from '../activities/activities.service';
import { CreateActivityDto } from '../activities/dto/create-activity.dto';
import { ActivitiesRouteTypeEnum } from '../activities/activities-route-type.enum';
import { BackendUser } from '../backend_users/entities/backend_user.entity';
import { DeleteRoleDto } from './dto/delete-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly permissionsService: PermissionsService,
    private readonly activitiesService: ActivitiesService,
  ) {}

  paginate(page: number, page_size: number) {
    return this.roleRepository
      .createQueryBuilder('role')
      .take(page_size)
      .select(['role.id', 'role.name'])
      .skip(page_size * (page - 1))
      .getManyAndCount();
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException();
    }
    return role;
  }

  async create(createRoleDto: CreateRoleDto, current_user_id: number) {
    const role = await this.roleRepository.create({ name: createRoleDto.name });
    role.permissions = await this.permissionsService.findByIds(
      createRoleDto.permissions,
    );

    role.created_by = { id: current_user_id } as BackendUser;
    role.last_update_by = { id: current_user_id } as BackendUser;

    const created_role = await this.roleRepository.save(role);

    await this.activitiesService.create(
      {
        name: 'Role was created!',
        request_type: ActivitiesRouteTypeEnum.post,
        route: `/roles`,
        after_update_action: created_role,
      } as CreateActivityDto,
      current_user_id,
    );

    return created_role;
  }

  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
    currentUserId: number,
  ) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException();
    }

    await this.activitiesService.create(
      {
        name: 'Role was updated!',
        request_type: ActivitiesRouteTypeEnum.patch,
        route: `/roles/${id}`,
        before_update_action: role,
        after_update_action: updateRoleDto,
      } as CreateActivityDto,
      currentUserId,
    );

    Object.assign(role, { name: updateRoleDto.name });

    role.permissions = await this.permissionsService.findByIds(
      updateRoleDto.permissions,
    );

    role.last_update_by = { id: currentUserId } as BackendUser;

    return await this.roleRepository.save(role);
  }

  async remove(
    id: number,
    deleteRoleDto: DeleteRoleDto,
    current_user_id: number,
  ) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException();
    }

    role.last_update_by = { id: current_user_id } as BackendUser;
    role.deleted_by = { id: current_user_id } as BackendUser;
    role.deleted_reason = deleteRoleDto.deleted_reason;
    await this.roleRepository.save(role);

    return this.roleRepository.softDelete({ id });
  }

  async trash(page: number, page_size: number) {
    return this.roleRepository
      .createQueryBuilder('role')
      .withDeleted()
      .where('role.deleted_at IS NOT NULL')
      .leftJoinAndSelect('role.deleted_by', 'deleted_by')
      .leftJoinAndSelect('role.created_by', 'created_by')
      .leftJoinAndSelect('role.last_update_by', 'last_update_by')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .select([
        'role.id',
        'role.name',
        'role.deleted_at',
        'role.created_at',
        'role.deleted_reason',
        'deleted_by.id',
        'deleted_by.name',
        'deleted_by.email',
        'created_by.id',
        'created_by.name',
        'created_by.email',
        'last_update_by.id',
        'last_update_by.name',
        'last_update_by.email',
        'permissions.id',
        'permissions.subject',
        'permissions.action',
      ])
      .take(page_size)
      .skip(page_size * (page - 1))
      .getManyAndCount();
  }
}
