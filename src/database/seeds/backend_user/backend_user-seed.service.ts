import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BackendUser } from '../../../modules/backend_users/entities/backend_user.entity';
import { RoleEnum } from '../../../modules/roles/roles.enum';
import { LanguagesEnum } from '../../../modules/languages/languages.enum';

@Injectable()
export class BackendUserSeedService {
  constructor(
    @InjectRepository(BackendUser)
    private repository: Repository<BackendUser>,
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
