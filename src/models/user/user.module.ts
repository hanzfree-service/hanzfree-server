import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LocalAuthService } from 'src/auth/local-auth/local-auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtRefreshGuard } from 'src/auth/jwt-refresh.guard';
import { JwtRefreshStrategy } from 'src/auth/jwt-refresh.strategy';
import { LocalAuthModule } from 'src/auth/local-auth/local-auth.module';
import { ReservationService } from '../reservation/reservation.service';
import { ReservationModule } from '../reservation/reservation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
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
    forwardRef(() => LocalAuthModule),
    ReservationModule,
  ],
  exports: [TypeOrmModule, UserService],
  controllers: [UserController],
  providers: [
    UserService,
    LocalAuthService,
    UserRepository,
    ConfigService,
    JwtAuthGuard,
    JwtRefreshStrategy,
    ReservationService,
  ],
})
export class UserModule {}
