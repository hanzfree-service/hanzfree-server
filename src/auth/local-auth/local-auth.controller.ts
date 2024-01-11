import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthService } from 'src/auth/local-auth/local-auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { UserService } from 'src/models/user/user.service';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { Response } from 'express';
import { JwtRefreshGuard } from '../jwt-refresh.guard';
import { User } from 'src/models/user/entities/user.entity';

@ApiTags('auth-controller')
@Controller('auth')
export class LocalAuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: LocalAuthService,
  ) {}

  @Post('login')
  @ApiOperation({
    summary: '로그인 API',
    description: 'email password를 확인 후 JWT 토큰을 발급한다.',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const user = await this.authService.validateUser(loginDto);
    const access_token = await this.authService.generateAccessToken(user);
    const refresh_token = await this.authService.generateRefreshToken(user);

    console.log('access_token', access_token);
    console.log('refresh_token', refresh_token);

    // refresh token DB에 저장
    const refreshTokenInfo = await this.userService.setCurrentRefreshToken(
      refresh_token,
      user.id,
    );

    res.setHeader('Authorization', 'Bearer ' + [access_token, refresh_token]);
    res.cookie('access_token', access_token, {
      // httpOnly: true,
      sameSite: 'none',
      secure: true,
      // secure: process.env.NODE_ENV === 'production', // HTTPS를 통해서만 쿠키 전송
    });
    res.cookie('refresh_token', refresh_token, {
      // httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return {
      ...user,
      currentRefreshTokenExp: refreshTokenInfo.currentRefreshTokenExp,
    };
  }

  @Post('logout')
  @UseGuards(JwtRefreshGuard)
  async logout(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    await this.userService.removeRefreshToken(req.user.id);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return 'logout success';
  }

  @Get('authenticate')
  @UseGuards(JwtAuthGuard)
  async user(@Req() req: any): Promise<User> {
    const userId: number = req.user.id;
    const verifiedUser = await this.userService.findUserById(userId);

    return verifiedUser;
  }

  @Post('refresh')
  async refresh(
    @Req() req: any,
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const refreshToken = req.cookies['refresh_token'];
      const newAccessToken = (await this.authService.refresh(refreshToken))
        .accessToken;
      res.setHeader('Authorization', 'Bearer ' + newAccessToken);
      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
      });

      return { newAccessToken };
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh-token');
    }
  }
}
