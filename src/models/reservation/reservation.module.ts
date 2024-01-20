import { Module, forwardRef } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthService } from 'src/auth/local-auth/local-auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalAuthModule } from 'src/auth/local-auth/local-auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
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
  ],
  exports: [TypeOrmModule, ReservationService],
  controllers: [ReservationController],
  providers: [ReservationService, JwtAuthGuard],
})
export class ReservationModule {}
