import { User } from 'src/models/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Good {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  good_name: string;

  @Column()
  price: string;

  @ManyToOne(() => User, (user) => user.goods)
  user: User;
}
