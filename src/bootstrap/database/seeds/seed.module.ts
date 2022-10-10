import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TypeOrmConfigService } from '../typeorm-config.service';
import { LanguageSeedModule } from './language/language-seed.module';
import { RoleSeedModule } from './role/role-seed.module';
import { PermissionSeedModule } from './permission/permission-seed.module';
import { databaseConfig } from '../../config/database.config';
import { appConfig } from '../../config/app.config';
import { BackendUserSeedModule } from './backend_user/backend_user-seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        return await new DataSource(options).initialize();
      },
    }),
    LanguageSeedModule,
    PermissionSeedModule,
    RoleSeedModule,
    BackendUserSeedModule,
  ],
})
export class SeedModule {}
