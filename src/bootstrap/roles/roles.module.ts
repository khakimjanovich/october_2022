import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { AbilityModule } from '../ability/ability.module';
import { IsNotExist } from '../utils/validators/is-not-exists.validator';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), AbilityModule, PermissionsModule],
  controllers: [RolesController],
  providers: [RolesService, IsNotExist],
})
export class RolesModule {}
