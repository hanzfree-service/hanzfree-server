import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LocalAuthModule } from './auth/local-auth/local-auth.module';
import { ApiResponseInterceptor } from './common/interceptors/response.interceptor';
import { DatabaseModule } from './database/database.module';
import { GoodsModule } from './models/goods/goods.module';
import { UserModule } from './models/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './common/scheduled/tasks.service';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true, // 전역 설정으로 사용
    }),
    ScheduleModule.forRoot(),
    UserModule,
    GoodsModule,
    LocalAuthModule,
  ],

  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
    TasksService,
  ],
})
export class AppModule {}
