import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Good } from './entities/good.entity';

@Injectable()
export class GoodsRepository {
  private goodsRepository: Repository<Good>;

  constructor(private readonly dataSource: DataSource) {
    this.goodsRepository = this.dataSource.getRepository(Good);
  }
}
