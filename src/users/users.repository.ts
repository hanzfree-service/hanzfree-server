import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UsersRepository {
  private usersRepository: Repository<User>;

  constructor(private readonly dataSource: DataSource) {
    this.usersRepository = this.dataSource.getRepository(User);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, role } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
      role,
    });

    const savedUser = await this.usersRepository.save(user);

    // password 필드 제외하고 반환
    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async findUserByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findUserWithPasswordByUsername(username: string): Promise<User> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .addSelect('user.password')
      .getOne();
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findId(userIdx: number): Promise<User> {
    return this.usersRepository.findOne({ where: { user_idx: userIdx } });
  }

  async updateUser(
    userIdx: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    await this.usersRepository.update(userIdx, updateUserDto);

    return this.usersRepository.findOne({
      where: { user_idx: userIdx },
    });
  }

  async remove(userIdx: number): Promise<DeleteResult> {
    return this.usersRepository.delete(userIdx);
  }

  async findWithUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findUserByIdWithGoods(userIdx: number): Promise<User> {
    return this.usersRepository.findOne({
      where: { user_idx: userIdx },
      relations: ['goods'],
    });
  }
}
