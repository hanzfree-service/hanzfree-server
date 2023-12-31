import { Injectable } from '@nestjs/common';
import { CreateGoodDto } from './dto/create-good.dto';
import { UpdateGoodDto } from './dto/update-good.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Good } from './entities/good.entity';
import {
  DataSource,
  DeleteResult,
  InsertResult,
  Repository,
  UpdateResult,
  getRepository,
} from 'typeorm';

@Injectable()
export class GoodsService {
  constructor(
    @InjectRepository(Good)
    private goodRepository: Repository<Good>,
    private dataSource: DataSource,
  ) {}

  async create(createGoodDto: CreateGoodDto): Promise<InsertResult> {
    const { good_name, price } = createGoodDto;

    return await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Good)
      .values({
        good_name,
        price,
      })
      .execute();
  }

  async findAll(): Promise<Good[]> {
    return await this.dataSource
      .getRepository(Good)
      .createQueryBuilder('good')
      .getMany();
  }

  async findOne(good_idx: number): Promise<Good> {
    return await this.dataSource
      .getRepository(Good)
      .createQueryBuilder('good')
      .where('good.good_idx = :good_idx', { good_idx })
      .getOne();
  }

  async update(
    good_idx: number,
    updateGoodDto: UpdateGoodDto,
  ): Promise<UpdateResult> {
    const { good_name, price } = updateGoodDto;

    return await this.dataSource
      .createQueryBuilder()
      .update(Good)
      .set({ good_name, price })
      .where('good_idx = :good_idx', { good_idx })
      .execute();
  }

  async remove(good_idx: number): Promise<DeleteResult> {
    return await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(Good)
      .where('good_idx = :good_idx', { good_idx })
      .execute();
  }
}
