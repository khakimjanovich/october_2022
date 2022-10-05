import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { RoleEnum } from '../../../roles/roles.enum';
import { LanguagesEnum } from '../../../languages/languages.enum';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async run() {
    const countAdmin = await this.repository.count({
      where: {
        role: {
          id: RoleEnum.admin,
        },
      },
    });

    if (countAdmin === 0) {
      await this.repository.save(
        this.repository.create({
          name: 'Super Admin',
          email: 'admin@example.com',
          password: 'secret',
          role: {
            id: RoleEnum.admin,
          },
          locale: LanguagesEnum.en,
        }),
      );
    }

    const countUser = await this.repository.count({
      where: {
        role: {
          id: RoleEnum.user,
        },
      },
    });

    if (countUser === 0) {
      await this.repository.save(
        this.repository.create({
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'secret',
          role: {
            id: RoleEnum.user,
          },
          locale: LanguagesEnum.en,
        }),
      );
    }
  }
}
