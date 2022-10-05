import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { AbilityModule } from '../ability/ability.module';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), AbilityModule],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}
