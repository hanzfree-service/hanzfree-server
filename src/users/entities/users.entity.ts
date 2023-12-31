import { Role } from 'src/common/enums/role.enum';
import { Good } from 'src/goods/entities/good.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

@Entity()
// @Entity({name:'users'})
export class User {
  @PrimaryGeneratedColumn()
  user_idx!: number;

  @Column()
  username!: string;

  @Column({ select: false })
  password?: string;

  @Column({ default: Role.User })
  role: string;

  @OneToMany(() => Good, (good) => good.user)
  goods: Good[];

  @Column({ nullable: true })
  currentRefreshToken: string;

  @Column({ type: 'datetime', nullable: true })
  currentRefreshTokenExp: Date;

  @CreateDateColumn()
  createdAt: Date;
}
