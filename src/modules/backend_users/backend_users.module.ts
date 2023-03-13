import { forwardRef, Module } from '@nestjs/common';
import { BackendUsersService } from './backend_users.service';
import { BackendUsersController } from './backend_users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackendUser } from './entities/backend_user.entity';
import { PermissionsModule } from '../permissions/permissions.module';
import { ActivitiesModule } from '../activities/activities.module';
import { AbilityModule } from '../../utils/ability/ability.module';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';
import { IsExist } from '../../utils/validators/is-exists.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([BackendUser]),
    forwardRef(() => PermissionsModule),
    forwardRef(() => AbilityModule),
    forwardRef(() => ActivitiesModule),
  ],
  controllers: [BackendUsersController],
  providers: [BackendUsersService, IsNotExist, IsExist],
  exports: [BackendUsersService],
})
export class BackendUsersModule {}
