import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/users.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/users/dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<User> {
    const user = await this.usersService.findUserWithPasswordByUsername(
      loginDto.username,
    );

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    if (!(await bcrypt.compare(loginDto.password, user.password))) {
      throw new BadRequestException('Invalid credentials!');
    }

    return user;
  }

  // async login(user: any) {
  //   const payload = { username: user.username, sub: user.user_idx };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }

  async generateAccessToken(user: User): Promise<string> {
    const payload = {
      id: user.user_idx,
      username: user.username,
      role: user.role,
    };

    // const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
    // console.log('JWT Secret:', secret); // 로깅으로 값 확인

    return this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(user: User): Promise<string> {
    const payload = {
      id: user.user_idx,
      username: user.username,
      role: user.role,
    };

    return this.jwtService.signAsync(
      { id: payload.id },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRATION_TIME',
        ),
      },
    );
  }

  async refresh(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    const { refresh_token } = refreshTokenDto;

    // Verify refresh token
    // JWT Refresh Token 검증 로직
    const decodedRefreshToken = this.jwtService.verify(refresh_token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    // Check if user exists
    const userIdx = decodedRefreshToken.id;
    const user = await this.usersService.getUserIfRefreshTokenMatches(
      refresh_token,
      userIdx,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid user!');
    }

    // Generate new access token
    const accessToken = await this.generateAccessToken(user);

    return { accessToken };
  }
}
