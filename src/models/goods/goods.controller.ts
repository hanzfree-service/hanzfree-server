import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GoodsService } from './goods.service';
import { CreateGoodDto } from './dto/create-good.dto';
import { UpdateGoodDto } from './dto/update-good.dto';
import { ApiTags } from '@nestjs/swagger';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { Good } from './entities/good.entity';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('goods')
@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Post('register')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createGoodDto: CreateGoodDto): Promise<InsertResult> {
    return this.goodsService.create(createGoodDto);
  }

  @Get()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  findAll(): Promise<Good[]> {
    return this.goodsService.findAll();
  }

  @Get(':good_idx')
  findOne(@Param('good_idx') good_idx: string): Promise<Good> {
    return this.goodsService.findOne(+good_idx);
  }

  @Patch(':good_idx')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(
    @Param('good_idx') good_idx: string,
    @Body() updateGoodDto: UpdateGoodDto,
  ): Promise<UpdateResult> {
    return this.goodsService.update(+good_idx, updateGoodDto);
  }

  @Delete(':good_idx')
  remove(@Param('good_idx') good_idx: string): Promise<DeleteResult> {
    return this.goodsService.remove(+good_idx);
  }
}
