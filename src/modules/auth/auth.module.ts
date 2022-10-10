import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { LoginController } from './controllers/login.controller';
import { RegisterController } from './controllers/register.controller';
import { MeController } from './controllers/me.controller';
import { RefreshController } from './controllers/refresh.controller';
import { UsersModule } from '../users/users.module';
import { ActivitiesModule } from '../../bootstrap/activities/activities.module';
import { IsExist } from '../../bootstrap/utils/validators/is-exists.validator';
import { IsNotExist } from '../../bootstrap/utils/validators/is-not-exists.validator';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('auth.secret'),
        signOptions: {
          expiresIn: configService.get('auth.expires'),
        },
      }),
    }),
    ActivitiesModule,
  ],
  controllers: [
    LoginController,
    RegisterController,
    MeController,
    RefreshController,
  ],
  providers: [IsExist, IsNotExist, AuthService, JwtStrategy, AnonymousStrategy],
  exports: [AuthService],
})
export class AuthModule {}
