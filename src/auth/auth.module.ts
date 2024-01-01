import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../models/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../common/guards/local.strategy';
import { UserService } from 'src/models/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from 'src/models/user/user.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/user/entities/user.entity';
import { AuthController } from './auth.controller';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserModule,
    PassportModule,
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
    forwardRef(() => UserModule),
  ],
  exports: [AuthService, JwtAuthGuard, JwtRefreshStrategy],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    UserService,
    JwtAuthGuard,
    JwtRefreshStrategy,
    UserRepository,
    ConfigService,
  ],
})
export class AuthModule {}
