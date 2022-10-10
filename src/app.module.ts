import { Module } from '@nestjs/common';
import { BootstrapModule } from './bootstrap/bootstrap.module';
import { HomeModule } from './modules/home/home.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [BootstrapModule, HomeModule, UsersModule],
})
export class AppModule {}
