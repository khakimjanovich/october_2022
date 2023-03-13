import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { LanguageSeedService } from './language/language-seed.service';
import { PermissionSeedService } from './permission/permission-seed.service';
import { RoleSeedService } from './role/role-seed.service';
import { BackendUserSeedService } from './backend_user/backend_user-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(LanguageSeedService).run();
  await app.get(PermissionSeedService).run();
  await app.get(RoleSeedService).run();
  await app.get(BackendUserSeedService).run();
  await app.close();
};

void runSeed();
