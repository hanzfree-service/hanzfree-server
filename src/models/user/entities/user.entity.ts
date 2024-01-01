import { Role } from 'src/common/enums/role.enum';
import { Good } from 'src/models/goods/entities/good.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  username!: string;

  @Column({ select: false })
  password?: string;

  @Column({ default: Role.User })
  role: string;

  @OneToMany(() => Good, (good) => good.user)
  goods: Good[];

  @Column({ name: 'current_refresh_token', nullable: true })
  currentRefreshToken: string;

  @Column({
    name: 'current_refresh_token_exp',
    type: 'timestamp',
    nullable: true,
  })
  currentRefreshTokenExp: Date;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date = new Date();
}
