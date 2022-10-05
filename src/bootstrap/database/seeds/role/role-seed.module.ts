import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleSeedService } from './role-seed.service';
import { PermissionSeedModule } from '../permission/permission-seed.module';
import { Role } from '../../../roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), PermissionSeedModule],
  providers: [RoleSeedService],
  exports: [RoleSeedService],
})
export class RoleSeedModule {}
