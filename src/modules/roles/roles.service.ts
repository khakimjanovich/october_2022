import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { PermissionsService } from '../permissions/permissions.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ActivitiesService } from '../activities/activities.service';
import { BackendUser } from '../backend_users/entities/backend_user.entity';
import { DeleteRoleDto } from './dto/delete-role.dto';
import { Request } from 'express';
import { PaginationInterface } from '../../utils/resources/pagination.resource';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly permissionsService: PermissionsService,
    private readonly activitiesService: ActivitiesService,
  ) {}

  async paginate(page: number, page_size: number) {
    const [data, count] = await this.roleRepository.findAndCount({
      select: {
        id: true,
        name: true,
      },
      take: page_size,
      skip: (page - 1) * page_size,
    });

    return {
      page,
      data,
      count,
      page_size,
    };
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: {
        permissions: true,
        last_updated_by: true,
        created_by: true,
      },
      select: {
        id: true,
        name: true,
        created_at: true,
        created_by: {
          id: true,
          name: true,
          email: true,
        },
        last_updated_by: {
          id: true,
          name: true,
          email: true,
        },
        permissions: true,
      },
    });

    if (!role) {
      throw new NotFoundException();
    }
    return role;
  }

  async create(
    @Req() req: Request,
    createRoleDto: CreateRoleDto,
    current_user_id: number,
  ) {
    const role = await this.roleRepository.create({ name: createRoleDto.name });
    role.permissions = await this.permissionsService.findByIds(
      createRoleDto.permissions,
    );

    role.created_by = { id: current_user_id } as BackendUser;
    role.last_updated_by = { id: current_user_id } as BackendUser;

    const created_role = await this.roleRepository.save(role);

    await this.activitiesService.createActivity(
      req.originalUrl,
      req.method,
      current_user_id,
      created_role,
    );

    return created_role;
  }

  async update(
    req: Request,
    id: number,
    updateRoleDto: UpdateRoleDto,
    currentUserId: number,
  ) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException();
    }

    await this.activitiesService.createActivity(
      req.originalUrl,
      req.method,
      currentUserId,
      updateRoleDto,
      role,
    );

    Object.assign(role, { name: updateRoleDto.name });

    role.permissions = await this.permissionsService.findByIds(
      updateRoleDto.permissions,
    );

    role.last_updated_by = { id: currentUserId } as BackendUser;

    return await this.roleRepository.save(role);
  }

  async remove(
    req: Request,
    id: number,
    deleteRoleDto: DeleteRoleDto,
    current_user_id: number,
  ) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException();
    }

    await this.activitiesService.createActivity(
      req.originalUrl,
      req.method,
      current_user_id,
      {},
      role,
    );

    role.last_updated_by = { id: current_user_id } as BackendUser;
    role.deleted_by = { id: current_user_id } as BackendUser;
    role.deleted_reason = deleteRoleDto.deleted_reason;
    await this.roleRepository.save(role);

    return this.roleRepository.softDelete({ id });
  }

  async trash(page: number, page_size: number): Promise<PaginationInterface> {
    const [data, count] = await this.roleRepository.findAndCount({
      select: {
        id: true,
        name: true,
        permissions: {
          id: true,
          subject: true,
          action: true,
        },
        created_by: {
          id: true,
          name: true,
          email: true,
        },
        last_updated_by: {
          id: true,
          name: true,
          email: true,
        },
        deleted_by: {
          id: true,
          name: true,
          email: true,
        },
        created_at: true,
        deleted_at: true,
        updated_at: true,
      },
      relations: {
        created_by: true,
        last_updated_by: true,
        deleted_by: true,
        permissions: true,
      },
      where: {
        deleted_at: Not(IsNull()),
      },
      take: page_size,
      skip: (page - 1) * page_size,
    });

    return {
      page,
      data,
      count,
      page_size,
    };
  }
}
