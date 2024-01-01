import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { DeleteResult } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    // 이메일 중복 체크
    const emailExists = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (emailExists) {
      throw new ConflictException('This email is already in use.');
    }

    return this.userRepository.createUser(createUserDto);
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.findId(userId);

    const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);

    if (!user) {
      throw new NotFoundException(`User with user_idx ${userId} not found`);
    }

    return this.userRepository.updateUser(userId, {
      ...updateUserDto,
      password: hashedPassword,
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findId(userId: number): Promise<User> {
    const user = await this.userRepository.findId(userId);
    if (!user) {
      throw new NotFoundException(`User with user_idx ${userId} not found`);
    }
    return user;
  }

  async findUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findUserByUsername(username);

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  async findUserWithPasswordByEmail(email: string): Promise<User> {
    const user = this.userRepository.findUserWithPasswordByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async remove(userId: number): Promise<DeleteResult> {
    return this.userRepository.remove(userId);
  }

  async getUserByIdWithGoods(userId: number): Promise<User> {
    return this.userRepository.findUserByIdWithGoods(userId);
  }

  async getCurrentHashedRefreshToken(refreshToken: string) {
    // 토큰 값을 그대로 저장하기 보단, 암호화를 거쳐 데이터베이스에 저장한다.
    // bcrypt는 단방향 해시 함수이므로 암호화된 값으로 원래 문자열을 유추할 수 없다.

    const saltOrRounds = 10;
    const currentRefreshToken = await bcrypt.hash(refreshToken, saltOrRounds);
    return currentRefreshToken;
  }

  async getCurrentRefreshTokenExp(): Promise<Date> {
    const currentDate = new Date();

    console.log('currentDate', currentDate);
    console.log('getTime', currentDate.getTime());
    // Date 형식으로 데이터베이스에 저장하기 위해 문자열을 숫자 타입으로 변환 (paresInt)
    const currentRefreshTokenExp = new Date(
      currentDate.getTime() +
        parseInt(this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME')),
    );
    return currentRefreshTokenExp;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentRefreshToken =
      await this.getCurrentHashedRefreshToken(refreshToken);
    const currentRefreshTokenExp = await this.getCurrentRefreshTokenExp();
    await this.userRepository.updateUser(userId, {
      currentRefreshToken: currentRefreshToken,
      currentRefreshTokenExp: currentRefreshTokenExp,
    });
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userIdx: number,
  ): Promise<User> {
    const user: User = await this.findId(userIdx);

    // user에 currentRefreshToken이 없다면 null을 반환 (즉, 토큰 값이 null일 경우)
    if (!user.currentRefreshToken) {
      return null;
    }

    // 유저 테이블 내에 정의된 암호화된 refresh_token값과 요청 시 body에 담아준 refresh_token값 비교
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentRefreshToken,
    );

    // 만약 isRefreshTokenMatching이 true라면 user 객체를 반환
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number): Promise<any> {
    return await this.userRepository.updateUser(userId, {
      currentRefreshToken: null,
      currentRefreshTokenExp: null,
    });
  }

  async findUsersWithExpiredTokens(currentTime: number): Promise<User[]> {
    return this.userRepository.findUsersWithExpiredTokens(currentTime);
  }
}
