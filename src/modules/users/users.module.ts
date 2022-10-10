import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsNotExist } from '../../bootstrap/utils/validators/is-not-exists.validator';
import { ActivitiesModule } from '../../bootstrap/activities/activities.module';
import { BackendUsersModule } from '../../bootstrap/backend_users/backend_users.module';
import { AbilityModule } from '../../bootstrap/ability/ability.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ActivitiesModule,
    BackendUsersModule,
    AbilityModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, IsNotExist],
})
export class UsersModule {}
