import { Module } from '@nestjs/common';
import { databaseConfig } from './config/database.config';
import { authConfig } from './config/auth.config';
import { appConfig } from './config/app.config';
import { fileConfig } from './config/file.config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { DataSource } from 'typeorm';
import { AbilityModule } from './ability/ability.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { LanguagesModule } from './languages/languages.module';
import { ActivitiesModule } from './activities/activities.module';
import { FilesModule } from './files/files.module';
import { BackendUsersModule } from './backend_users/backend_users.module';

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
  ],
})
export class BootstrapModule {}
