import { Injectable } from '@nestjs/common';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  private userRepository: Repository<User>;

  constructor(private readonly dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // password 필드 제외하고 반환
    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async findUserByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findUserWithPasswordByEmail(email: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findId(userId: number): Promise<User> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    await this.userRepository.update(userId, updateUserDto);

    return this.userRepository.findOne({
      where: { id: userId },
    });
  }

  async remove(userId: number): Promise<DeleteResult> {
    return this.userRepository.delete(userId);
  }

  async findWithUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findUserByIdWithGoods(userId: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['goods'],
    });
  }

  async findUsersWithExpiredTokens(currentTime: number): Promise<User[]> {
    const usersWithExpiredTokens = this.userRepository
      .createQueryBuilder('user')
      .where('user.currentRefreshTokenExp <= :currentTime', {
        currentTime: new Date(currentTime),
      })
      .getMany();
    return usersWithExpiredTokens;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }
}
