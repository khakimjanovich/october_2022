import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackendUserSeedService } from './backend_user-seed.service';
import { BackendUser } from '../../../backend_users/entities/backend_user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BackendUser])],
  providers: [BackendUserSeedService],
  exports: [BackendUserSeedService],
})
export class BackendUserSeedModule {}
