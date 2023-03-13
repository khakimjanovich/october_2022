import { Module } from '@nestjs/common';
import { HomeModule } from './modules/home/home.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { ActivitiesModule } from './modules/activities/activities.module';
import { LanguagesModule } from './modules/languages/languages.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { BackendUsersModule } from './modules/backend_users/backend_users.module';
import { RolesModule } from './modules/roles/roles.module';
import { AuthModule } from './modules/auth/auth.module';
import { AbilityModule } from './utils/ability/ability.module';
import { FilesModule } from './modules/files/files.module';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import fileConfig from './config/file.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig, fileConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        return await new DataSource(options).initialize();
      },
    }),
    ActivitiesModule,
    LanguagesModule,
    PermissionsModule,
    RolesModule,
    BackendUsersModule,
    AuthModule,
    AbilityModule,
    FilesModule,
    HomeModule,
  ],
})
export class AppModule {}
