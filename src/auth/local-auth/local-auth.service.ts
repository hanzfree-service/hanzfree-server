import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../models/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/models/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/auth/dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

@Injectable()
export class LocalAuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<User> {
    const user = await this.usersService.findUserWithPasswordByEmail(
      loginDto.email,
    );

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    if (user.isSocialAccountRegistered) {
      throw new BadRequestException('Social account registered!');
    }

    if (!(await bcrypt.compare(loginDto.password, user.password))) {
      throw new BadRequestException('Invalid password!');
    }

    return user;
  }

  async generateAccessToken(user: User): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    return this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(user: User): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
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

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      // Verify refresh token
      // JWT Refresh Token 검증 로직
      const decodedRefreshToken = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // Check if user exists
      const id = decodedRefreshToken.id;
      const user = await this.usersService.getUserIfRefreshTokenMatches(
        refreshToken,
        id,
      );
      if (!user) {
        throw new UnauthorizedException('Invalid user!');
      }

      // Generate new access token
      const accessToken = await this.generateAccessToken(user);

      return { accessToken };
    } catch (err) {
      console.log('err', err);
      throw new UnauthorizedException('Invalid refresh-token');
    }
  }
}
