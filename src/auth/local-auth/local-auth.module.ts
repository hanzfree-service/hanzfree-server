import { Module, forwardRef } from '@nestjs/common';
import { LocalAuthService } from './local-auth.service';
import { UserModule } from '../../models/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../../common/guards/local.strategy';
import { UserService } from 'src/models/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from 'src/models/user/user.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/user/entities/user.entity';
import { LocalAuthController } from './local-auth.controller';
import { JwtRefreshStrategy } from '../jwt-refresh.strategy';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { GoogleAuthenticationController } from '../google/google-auth.controller';
import { GoogleStrategy } from '../google/google-auth.strategy';
import { GoogleAuthenticationService } from '../google/google-auth.service';
import { ReservationModule } from 'src/models/reservation/reservation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserModule,
    // PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRATION_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({
      session: false,
    }),
  ],
  exports: [LocalAuthService, JwtAuthGuard, JwtRefreshStrategy],
  controllers: [LocalAuthController, GoogleAuthenticationController],
  providers: [
    LocalAuthService,
    LocalStrategy,
    UserService,
    JwtAuthGuard,
    JwtRefreshStrategy,
    GoogleStrategy,
    UserRepository,
    ConfigService,
    GoogleAuthenticationService,
  ],
})
export class LocalAuthModule {}
