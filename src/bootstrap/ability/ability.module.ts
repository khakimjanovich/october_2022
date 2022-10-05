import { forwardRef, Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [AbilityFactory],
  exports: [AbilityFactory],
  imports: [forwardRef(() => UsersModule)],
})
export class AbilityModule {}
