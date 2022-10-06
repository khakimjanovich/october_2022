import { Module } from '@nestjs/common';
import { databaseConfig } from './config/database.config';
import { authConfig } from './config/auth.config';
import { appConfig } from './config/app.config';
import { fileConfig } from './config/file.config';
import * as path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule } from 'nestjs-i18n/dist/i18n.module';
import { HeaderResolver } from 'nestjs-i18n';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { DataSource } from 'typeorm';
import { AbilityModule } from './ability/ability.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LanguagesModule } from './languages/languages.module';
import { ActivitiesModule } from './activities/activities.module';
import { FilesModule } from './media/files.module';

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
    UsersModule,
    AuthModule,
    AbilityModule,
    FilesModule,
  ],
})
export class BootstrapModule {}
