import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ApiResponseInterceptor } from './common/interceptors/response.interceptor';
import { DatabaseModule } from './database/database.module';
import { GoodsModule } from './goods/goods.module';
import { QuestionModule } from './question/question.module';
import { UsersModule } from './users/users.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './common/scheduled/tasks.service';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true, // 전역 설정으로 사용
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    CategoryModule,
    QuestionModule,
    GoodsModule,
    AuthModule,
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
