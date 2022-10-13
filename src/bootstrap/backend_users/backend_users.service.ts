import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BackendUser } from './entities/backend_user.entity';
import { CreateBackendUserDto } from './dto/create-backend_user.dto';
import { UpdateBackendUserDto } from './dto/update-backend_user.dto';
import { DeleteBackendUserDto } from './dto/delete-backend_user.dto';
import { UpdateBackendUserPermissionsDto } from './dto/update-backend_user-permissions.dto';
import { PermissionsService } from '../permissions/permissions.service';
import { ActivitiesService } from '../activities/activities.service';
import { ActivitiesRouteTypeEnum } from '../activities/activities-route-type.enum';
import { CreateActivityDto } from '../activities/dto/create-activity.dto';

@Injectable()
export class BackendUsersService {
  constructor(
    @InjectRepository(BackendUser)
    private backendUsersRepository: Repository<BackendUser>,
    private readonly permissionsService: PermissionsService,
    private readonly activitiesService: ActivitiesService,
  ) {}

  async findOne(id: number): Promise<BackendUser> {
    const user = await this.backendUsersRepository
      .createQueryBuilder('backend_user')
      .leftJoinAndSelect('backend_user.role', 'role')
      .leftJoinAndSelect('backend_user.created_by', 'created_by')
      .leftJoinAndSelect('backend_user.last_update_by', 'last_update_by')
      .leftJoinAndSelect('backend_user.permissions', 'permissions')
      .select([
        'backend_user.id',
        'backend_user.locale',
        'backend_user.name',
        'backend_user.email',
        'backend_user.created_at',
        'backend_user.updated_at',
        'role.id',
        'role.name',
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
      .where('backend_user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'users.notFound',
        },
      });
    }

    return user;
  }

  async create(
    createUserDto: CreateBackendUserDto,
    current_user_id: number,
  ): Promise<BackendUser> {
    const user = await this.backendUsersRepository.create(createUserDto);
    if (current_user_id) {
      user.created_by = { id: current_user_id } as BackendUser;
      user.last_update_by = { id: current_user_id } as BackendUser;
    }

    if (current_user_id) {
      const current_user = await this.findOne(current_user_id);
      await this.activitiesService.create(
        {
          name: `${current_user.name} created user ${user.name}`,
          request_type: ActivitiesRouteTypeEnum.post,
          route: '/api/v1/backend_users',
          after_update_action: user,
        } as CreateActivityDto,
        current_user_id,
      );
    }

    return await this.backendUsersRepository.save(user);
  }

  async paginate(page_size: number, page: number, search: string) {
    return await this.backendUsersRepository
      .createQueryBuilder('backend_user')
      .where('backend_user.email LIKE :search', { search: `%${search}%` })
      .orWhere('backend_user.name LIKE :search', { search: `%${search}%` })
      .leftJoinAndSelect('backend_user.role', 'role')
      .leftJoinAndSelect('backend_user.created_by', 'created_by')
      .leftJoinAndSelect('backend_user.last_update_by', 'last_update_by')
      .select([
        'backend_user.id',
        'backend_user.locale',
        'backend_user.name',
        'backend_user.email',
        'backend_user.created_at',
        'backend_user.created_by',
        'created_by.id',
        'created_by.name',
        'created_by.email',
        'last_update_by.id',
        'last_update_by.name',
        'last_update_by.email',
        'role.name',
        'role.id',
      ])
      .orderBy('backend_user.id', 'DESC')
      .take(page_size)
      .skip((page - 1) * page_size)
      .getManyAndCount();
  }

  async update(
    id: number,
    updateUserDto: UpdateBackendUserDto,
    current_user_id: number,
  ): Promise<BackendUser> {
    const user = await this.findOne(id);

    if (updateUserDto.email)
      await this.checkIfEmailUnique(updateUserDto.email, user.id);

    if (current_user_id) {
      const current_user = await this.findOne(current_user_id);
      await this.activitiesService.create(
        {
          name: `${current_user.name} updated user ${user.name}`,
          request_type: ActivitiesRouteTypeEnum.patch,
          route: '/api/v1/backend_users' + user.id,
          before_update_action: user,
          after_update_action: updateUserDto,
        } as CreateActivityDto,
        current_user_id,
      );
    }

    Object.assign(user, updateUserDto);

    user.last_update_by = { id: current_user_id } as BackendUser;

    return this.backendUsersRepository.save(user);
  }

  async remove(
    id: number,
    deleteUserDto: DeleteBackendUserDto,
    current_user_id: number,
  ) {
    const user = await this.findOne(id);
    Object.assign(user, deleteUserDto);

    if (current_user_id) {
      const current_user = await this.findOne(current_user_id);
      await this.activitiesService.create(
        {
          name: `${current_user.name} deleted user ${user.name}`,
          request_type: ActivitiesRouteTypeEnum.delete,
          route: '/api/v1/backend_users/' + user.id,
        } as CreateActivityDto,
        current_user_id,
      );
    }

    const current_user = await this.findOne(current_user_id);
    delete current_user?.role?.permissions;

    user.deleted_by = current_user;
    await this.backendUsersRepository.save(user);

    await this.activitiesService.create(
      {
        name: `${current_user.name} has deleted the user`,
        before_update_action: user,
        route: '/api/v1/users/delete',
        request_type: ActivitiesRouteTypeEnum.delete,
        after_update_action: null,
      },
      current_user.id,
    );

    await this.backendUsersRepository.softDelete(id);

    return user;
  }

  async findOneByEmail(email: string): Promise<BackendUser> {
    const user = await this.backendUsersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'users.notFoundWithEmail',
        },
      });
    }

    delete user.deleted_reason;
    delete user.deleted_at;
    delete user.role?.permissions;
    delete user.previousPassword;

    return user;
  }

  async trash(page_size: number, page: number, search: string) {
    return await this.backendUsersRepository
      .createQueryBuilder('backend_user')
      .withDeleted()
      .where('backend_user.deleted_at IS NOT NULL')
      .andWhere('backend_user.email LIKE :search', { search: `%${search}%` })
      .leftJoinAndSelect('backend_user.role', 'role')
      .leftJoinAndSelect('backend_user.created_by', 'created_by')
      .leftJoinAndSelect('backend_user.last_update_by', 'last_update_by')
      .leftJoinAndSelect('backend_user.deleted_by', 'deleted_by')
      .select([
        'backend_user.id',
        'backend_user.locale',
        'backend_user.name',
        'backend_user.email',
        'backend_user.deleted_at',
        'backend_user.deleted_by',
        'backend_user.deleted_reason',
        'backend_user.created_at',
        'backend_user.created_by',
        'created_by.name',
        'created_by.email',
        'last_update_by.name',
        'last_update_by.email',
        'deleted_by.name',
        'deleted_by.email',
        'role.name',
        'role.id',
      ])
      .orderBy('backend_user.deleted_at', 'DESC')
      .take(page_size)
      .skip((page - 1) * page_size)
      .getManyAndCount();
  }

  async updatePermissions(
    id: number,
    updateUserPermissionsDto: UpdateBackendUserPermissionsDto,
    current_user_id: number,
  ) {
    const user = await this.findOne(id);

    user.permissions = await this.permissionsService.findByIds(
      updateUserPermissionsDto.permissions,
    );

    if (current_user_id) {
      const current_user = await this.findOne(current_user_id);
      await this.activitiesService.create(
        {
          name: `${current_user.name} updated user ${user.name} permissions`,
          request_type: ActivitiesRouteTypeEnum.post,
          route: '/api/v1/backend_users' + user.id + '/permissions',
        } as CreateActivityDto,
        current_user_id,
      );
    }

    user.last_update_by = { id: current_user_id } as BackendUser;
    return this.backendUsersRepository.save(user);
  }

  private async checkIfEmailUnique(email: string, id: number) {
    const user = await this.backendUsersRepository.findOne({
      where: { email },
    });

    if (user && user.id !== id) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'users.emailAlreadyTaken',
        },
      });
    }
  }
}
