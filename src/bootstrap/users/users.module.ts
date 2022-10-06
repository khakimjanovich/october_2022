import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { IsNotExist } from '../utils/validators/is-not-exists.validator';
import { IsExist } from '../utils/validators/is-exists.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PermissionsModule } from '../permissions/permissions.module';
import { AbilityModule } from '../ability/ability.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => PermissionsModule),
    forwardRef(() => AbilityModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, IsNotExist, IsExist],
  exports: [UsersService],
})
export class UsersModule {}
