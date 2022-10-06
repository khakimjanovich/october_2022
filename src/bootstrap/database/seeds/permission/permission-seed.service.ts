import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../../../permissions/entities/permission.entity';

@Injectable()
export class PermissionSeedService {
  constructor(
    @InjectRepository(Permission)
    private repository: Repository<Permission>,
  ) {}

  async run() {
    const subjects: string[] = [
      'File',
      'Activity',
      'Language',
      'Permission',
      'Role',
      'User',
    ];

    const actions: string[] = [
      'index',
      'create',
      'read',
      'update',
      'delete',
      'trash',
    ];

    for (const subject of subjects) {
      for (const action of actions) {
        const permission = await this.repository.findOne({
          where: {
            subject,
            action,
          },
        });

        if (!permission) {
          await this.repository.save(
            this.repository.create({
              subject,
              action,
            }),
          );
        }
      }
    }
  }

  findAll() {
    return this.repository.find();
  }
}
