import { Exclude } from 'class-transformer';
import { Provider } from 'src/common/enums/provider.enum';
import { Role } from 'src/common/enums/role.enum';
import { Good } from 'src/models/goods/entities/good.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ default: Role.USER })
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

  // 아래의 프로퍼티부터 소셜 로그인과 관련
  @Column({ default: false })
  isSocialAccountRegistered: boolean;

  @Column({ name: 'social_provider', default: Provider.LOCAL })
  socialProvider: string;

  @Column({ name: 'external_id', nullable: true, default: null })
  externalId: string;
}
