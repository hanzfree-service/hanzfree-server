import { Injectable } from '@nestjs/common';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { SocialLoginInfoDto } from 'src/auth/dto/social-login-info.dto';

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
      profileImg: 'http://www.gravatar.com/avatar/?d=mp',
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    return savedUser;
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
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

  async findId(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id: id } });
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

  async createSocialUser(
    socialLoginInfoDto: SocialLoginInfoDto,
  ): Promise<User> {
    const {
      email,
      firstName,
      lastName,
      profileImg,
      socialProvider,
      countryCode,
      externalId,
    } = socialLoginInfoDto;

    const user = this.userRepository.create({
      email: email,
      firstName: firstName,
      lastName: lastName,
      profileImg: profileImg,
      isSocialAccountRegistered: true,
      socialProvider: socialProvider,
      externalId: externalId,
      countryCode: countryCode,
    });

    return this.userRepository.save(user);
  }
}
