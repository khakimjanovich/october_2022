import { Module } from '@nestjs/common';
import { BootstrapModule } from './bootstrap/bootstrap.module';
import { HomeModule } from './modules/home/home.module';

@Module({
  imports: [BootstrapModule, HomeModule],
})
export class AppModule {}
