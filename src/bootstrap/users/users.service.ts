import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'users.notFound',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<{ data: User }> {
    return {
      data: await this.usersRepository.save(
        await this.usersRepository.create(createUserDto),
      ),
    };
  }

  async paginate(page_size: number, page: number, search: string) {
    const [data, count] = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email LIKE :search', { search: `%${search}%` })
      .orWhere('user.name LIKE :search', { search: `%${search}%` })
      .leftJoinAndSelect('user.role', 'role')
      .select([
        'user.id',
        'user.locale',
        'user.name',
        'user.email',
        'role.name',
        'role.id',
      ])
      .orderBy('user.id', 'DESC')
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

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email)
      await this.checkIfEmailUnique(updateUserDto.email, user.id);

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    return this.usersRepository.delete(id);
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'users.notFoundWithEmail',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return user;
  }

  private async checkIfEmailUnique(email: string, id: number) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (user && user.id !== id) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'users.emailAlreadyTaken',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
