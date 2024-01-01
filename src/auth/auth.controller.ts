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
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { UserService } from 'src/models/user/user.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Response } from 'express';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { User } from 'src/models/user/entities/user.entity';

@ApiTags('auth-controller')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
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

    // refresh token DB에 저장
    await this.userService.setCurrentRefreshToken(refresh_token, user.id);

    res.setHeader('Authorization', 'Bearer ' + [access_token, refresh_token]);
    res.cookie('access_token', access_token, {
      httpOnly: true,
    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
    });
    return {
      message: 'login success',
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }

  @Post('logout')
  @UseGuards(JwtRefreshGuard)
  async logout(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    await this.userService.removeRefreshToken(req.user.user_idx);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return {
      message: 'logout success',
    };
  }

  @Get('authenticate')
  @UseGuards(JwtAuthGuard)
  async user(@Req() req: any): Promise<User> {
    const userId: number = req.user.id;
    const verifiedUser = await this.userService.findId(userId);

    return verifiedUser;
  }

  @Post('refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const newAccessToken = (await this.authService.refresh(refreshTokenDto))
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
