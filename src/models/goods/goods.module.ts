import { Module } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { GoodsController } from './goods.controller';
import { Good } from './entities/good.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalAuthModule } from 'src/auth/local-auth/local-auth.module';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Good])],
  controllers: [GoodsController],
  providers: [GoodsService],
})
export class GoodsModule {}
