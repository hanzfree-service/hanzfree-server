import { User } from 'src/users/entities/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Good {
  @PrimaryGeneratedColumn()
  good_idx: number;

  @Column()
  good_name: string;

  @Column()
  price: string;

  @ManyToOne(() => User, (user) => user.goods)
  user: User;
}
