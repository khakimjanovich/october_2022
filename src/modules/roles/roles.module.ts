import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './entities/role.entity';
import { ActivitiesModule } from '../activities/activities.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { AbilityModule } from '../../utils/ability/ability.module';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    AbilityModule,
    PermissionsModule,
    ActivitiesModule,
  ],
  controllers: [RolesController],
  providers: [RolesService, IsNotExist],
})
export class RolesModule {}
