import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { BackendUser } from './entities/backend_user.entity';
import { CreateBackendUserDto } from './dto/create-backend_user.dto';
import { UpdateBackendUserDto } from './dto/update-backend_user.dto';
import { DeleteBackendUserDto } from './dto/delete-backend_user.dto';
import { UpdateBackendUserPermissionsDto } from './dto/update-backend_user-permissions.dto';
import { PermissionsService } from '../permissions/permissions.service';
import { ActivitiesService } from '../activities/activities.service';
import { Request } from 'express';

@Injectable()
export class BackendUsersService {
  constructor(
    @InjectRepository(BackendUser)
    private backendUsersRepository: Repository<BackendUser>,
    private readonly permissionsService: PermissionsService,
    private readonly activitiesService: ActivitiesService,
  ) {}

  async findOne(id: number): Promise<BackendUser> {
    const user = await this.backendUsersRepository.findOne({
      where: {
        id,
      },
      relations: {
        role: {
          permissions: true,
        },
        created_by: true,
        last_updated_by: true,
        permissions: true,
      },
      select: {
        id: true,
        locale: true,
        name: true,
        email: true,
        avatar: true,
        created_at: true,
        updated_at: true,
        role: {
          id: true,
          name: true,
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
        permissions: {
          id: true,
          subject: true,
          action: true,
        },
      },
    });

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'users.notFound',
        },
      });
    }

    delete user.role.permissions;

    return user;
  }

  async create(
    req: Request,
    createUserDto: CreateBackendUserDto,
    current_user_id: number,
  ): Promise<BackendUser> {
    const user = await this.backendUsersRepository.create(createUserDto);
    if (current_user_id) {
      user.created_by = { id: current_user_id } as BackendUser;
      user.last_updated_by = { id: current_user_id } as BackendUser;
    }

    if (current_user_id) {
      await this.activitiesService.createActivity(
        req.originalUrl,
        req.method,
        current_user_id,
        user,
      );
    }

    return await this.backendUsersRepository.save(user);
  }

  async paginate(page_size: number, page: number, search: string) {
    const [data, count] = await this.backendUsersRepository.findAndCount({
      where: {
        email: ILike(`%${search}%`),
        name: ILike(`%${search}%`),
      },
      relations: {
        created_by: true,
        last_updated_by: true,
      },
      select: {
        id: true,
        name: true,
        locale: true,
        email: true,
        created_at: true,
        role: {
          id: true,
          name: true,
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
        permissions: {
          id: true,
          subject: true,
          action: true,
        },
      },
      take: page_size,
      skip: (page - 1) * page_size,
    });

    return {
      page,
      data,
      page_size,
      count,
    };
  }

  async update(
    req: Request,
    id: number,
    updateUserDto: UpdateBackendUserDto,
    current_user_id: number,
  ): Promise<BackendUser> {
    const user = await this.findOne(id);

    if (current_user_id) {
      await this.activitiesService.createActivity(
        req.originalUrl,
        req.method,
        current_user_id,
        updateUserDto,
        user,
      );
    }

    Object.assign(user, updateUserDto);

    user.last_updated_by = { id: current_user_id } as BackendUser;

    return this.backendUsersRepository.save(user);
  }

  async remove(
    req: Request,
    id: number,
    deleteUserDto: DeleteBackendUserDto,
    current_user_id: number,
  ) {
    const user = await this.findOne(id);
    Object.assign(user, deleteUserDto);

    const current_user = await this.findOne(current_user_id);
    delete current_user?.role?.permissions;

    user.deleted_by = { id: current_user.id } as BackendUser;
    await this.backendUsersRepository.save(user);

    await this.backendUsersRepository.softDelete(id);

    await this.activitiesService.createActivity(
      req.originalUrl,
      req.method,
      current_user_id,
      {},
      user,
    );

    return user;
  }

  async findOneByEmail(
    email: string,
    relations: object = {},
  ): Promise<BackendUser> {
    const user = await this.backendUsersRepository.findOne({
      where: { email },
      relations,
    });

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'users.notFoundWithEmail',
        },
      });
    }

    return user;
  }

  async trash(page_size: number, page: number, search: string) {
    const [data, count] = await this.backendUsersRepository.findAndCount({
      where: {
        email: ILike(`%${search}%`),
        name: ILike(`%${search}%`),
        deleted_at: Not(IsNull()),
      },
      relations: {
        created_by: true,
        last_updated_by: true,
        deleted_by: true,
      },
      select: {
        deleted_reason: true,
        id: true,
        name: true,
        locale: true,
        email: true,
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
      take: page_size,
      skip: (page - 1) * page_size,
      withDeleted: true,
    });

    return {
      page,
      data,
      count,
      page_size,
    };
  }

  async updatePermissions(
    req: Request,
    id: number,
    updateUserPermissionsDto: UpdateBackendUserPermissionsDto,
    current_user_id: number,
  ) {
    const user = await this.findOne(id);

    user.permissions = await this.permissionsService.findByIds(
      updateUserPermissionsDto.permissions,
    );

    if (current_user_id) {
      await this.activitiesService.createActivity(
        req.originalUrl,
        req.method,
        current_user_id,
      );
    }

    user.last_updated_by = { id: current_user_id } as BackendUser;

    return this.backendUsersRepository.save(user);
  }
}
