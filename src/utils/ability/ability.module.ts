import { forwardRef, Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { BackendUsersModule } from '../../modules/backend_users/backend_users.module';

@Module({
  providers: [AbilityFactory],
  exports: [AbilityFactory],
  imports: [forwardRef(() => BackendUsersModule)],
})
export class AbilityModule {}
