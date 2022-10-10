import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionsService } from '../../bootstrap/permissions/permissions.service';
import { ActivitiesService } from '../../bootstrap/activities/activities.service';
import { ActivitiesRouteTypeEnum } from '../../bootstrap/activities/activities-route-type.enum';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { BackendUser } from '../../bootstrap/backend_users/entities/backend_user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { BackendUsersService } from '../../bootstrap/backend_users/backend_users.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersService: Repository<User>,
    private readonly permissionsService: PermissionsService,
    private readonly activitiesService: ActivitiesService,
    private readonly backendUserService: BackendUsersService,
  ) {}

  async findOne(id: number): Promise<User> {
    const user = await this.usersService
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.created_by', 'created_by')
      .leftJoinAndSelect('user.last_update_by', 'last_update_by')
      .leftJoinAndSelect('user.permissions', 'permissions')
      .select([
        'user.id',
        'user.locale',
        'user.name',
        'user.email',
        'user.created_at',
        'user.updated_at',
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
      .where('user.id = :id', { id })
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
    createUserDto: CreateUserDto,
    current_user_id: number,
  ): Promise<User> {
    const user = await this.usersService.create(createUserDto);
    if (current_user_id) {
      user.created_by = { id: current_user_id } as BackendUser;
      user.last_update_by = { id: current_user_id } as BackendUser;
    }
    return await this.usersService.save(user);
  }

  async paginate(page_size: number, page: number, search: string) {
    return await this.usersService
      .createQueryBuilder('user')
      .where('user.email LIKE :search', { search: `%${search}%` })
      .orWhere('user.name LIKE :search', { search: `%${search}%` })
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.created_by', 'created_by')
      .leftJoinAndSelect('user.last_update_by', 'last_update_by')
      .select([
        'user.id',
        'user.locale',
        'user.name',
        'user.email',
        'user.created_at',
        'user.created_by',
        'created_by.id',
        'created_by.name',
        'created_by.email',
        'last_update_by.id',
        'last_update_by.name',
        'last_update_by.email',
        'role.name',
        'role.id',
      ])
      .orderBy('user.id', 'DESC')
      .take(page_size)
      .skip((page - 1) * page_size)
      .getManyAndCount();
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    current_user_id: number,
  ): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email)
      await this.checkIfEmailUnique(updateUserDto.email, user.id);

    Object.assign(user, updateUserDto);

    user.last_update_by = { id: current_user_id } as BackendUser;

    return this.usersService.save(user);
  }

  async remove(
    id: number,
    deleteUserDto: DeleteUserDto,
    current_user_id: number,
  ) {
    const user = await this.findOne(id);
    Object.assign(user, deleteUserDto);

    const current_user = await this.backendUserService.findOne(current_user_id);

    user.deleted_by = current_user;
    await this.usersService.save(user);

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

    await this.usersService.softDelete(id);

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersService.findOne({
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

    return user;
  }

  async trash(page_size: number, page: number, search: string) {
    return await this.usersService
      .createQueryBuilder('user')
      .withDeleted()
      .where('user.deleted_at IS NOT NULL')
      .andWhere('user.email LIKE :search', { search: `%${search}%` })
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.created_by', 'created_by')
      .leftJoinAndSelect('user.last_update_by', 'last_update_by')
      .leftJoinAndSelect('user.deleted_by', 'deleted_by')
      .select([
        'user.id',
        'user.locale',
        'user.name',
        'user.email',
        'user.deleted_at',
        'user.deleted_by',
        'user.deleted_reason',
        'user.created_at',
        'user.created_by',
        'created_by.name',
        'created_by.email',
        'last_update_by.name',
        'last_update_by.email',
        'deleted_by.name',
        'deleted_by.email',
        'role.name',
        'role.id',
      ])
      .orderBy('user.deleted_at', 'DESC')
      .take(page_size)
      .skip((page - 1) * page_size)
      .getManyAndCount();
  }

  private async checkIfEmailUnique(email: string, id: number) {
    const user = await this.usersService.findOne({
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
