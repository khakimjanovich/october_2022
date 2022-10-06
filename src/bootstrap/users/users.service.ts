import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateUserPermissionsDto } from './dto/update-user-permissions.dto';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly permissionsService: PermissionsService,
  ) {}

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository
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
    const user = await this.usersRepository.create(createUserDto);
    user.created_by = { id: current_user_id } as User;
    user.last_update_by = { id: current_user_id } as User;
    return await this.usersRepository.save(user);
  }

  async paginate(page_size: number, page: number, search: string) {
    return await this.usersRepository
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

    user.last_update_by = { id: current_user_id } as User;

    return this.usersRepository.save(user);
  }

  async remove(
    id: number,
    deleteUserDto: DeleteUserDto,
    current_user_id: number,
  ) {
    const user = await this.findOne(id);
    Object.assign(user, deleteUserDto);
    user.deleted_by = { id: current_user_id } as User;
    await this.usersRepository.save(user);
    await this.usersRepository.softDelete(id);
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });

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
    return await this.usersRepository
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

  async updatePermissions(
    id: number,
    updateUserPermissionsDto: UpdateUserPermissionsDto,
    current_user_id: number,
  ) {
    const user = await this.findOne(id);

    user.permissions = await this.permissionsService.findByIds(
      updateUserPermissionsDto.permissions,
    );

    user.last_update_by = { id: current_user_id } as User;
    return this.usersRepository.save(user);
  }

  private async checkIfEmailUnique(email: string, id: number) {
    const user = await this.usersRepository.findOne({
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
