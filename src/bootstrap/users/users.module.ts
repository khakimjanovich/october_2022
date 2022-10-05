import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { IsNotExist } from '../utils/validators/is-not-exists.validator';
import { IsExist } from '../utils/validators/is-exists.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, IsNotExist, IsExist],
  exports: [UsersService],
})
export class UsersModule {}
