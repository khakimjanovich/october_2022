import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionSeedService } from '../permission/permission-seed.service';
import { Role } from '../../../roles/entities/role.entity';
import { RoleEnum } from '../../../roles/roles.enum';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(Role)
    private repository: Repository<Role>,
    private permissionService: PermissionSeedService,
  ) {}

  async run() {
    const countUser = await this.repository.count({
      where: {
        id: RoleEnum.user,
      },
    });

    if (countUser === 0) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.user,
          name: 'User',
        }),
      );
    }

    const countAdmin = await this.repository.count({
      where: {
        id: RoleEnum.admin,
      },
    });

    if (countAdmin === 0) {
      const admin = this.repository.create({
        id: RoleEnum.admin,
        name: 'Admin',
      });
      admin.permissions = await this.permissionService.findAll();

      await this.repository.save(admin);
    }
  }
}
