import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
// import { User } from './interfaces/user.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
// import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { LoginDto } from 'src/users/dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Response } from 'express';
import { JwtRefreshGuard } from './jwt-refresh.guard';

@ApiTags('auth-controller')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @ApiOperation({
    summary: '로그인 API',
    description: 'username과 password를 확인 후 JWT 토큰을 발급한다.',
  })
  //   @UseGuards(LocalAuthGuard)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const user = await this.authService.validateUser(loginDto);
    const access_token = await this.authService.generateAccessToken(user);
    const refresh_token = await this.authService.generateRefreshToken(user);

    // refresh token DB에 저장
    // 유저 객체에 refresh-token 데이터 저장
    await this.userService.setCurrentRefreshToken(refresh_token, user.user_idx);

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
  async user(@Req() req: any): Promise<any> {
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
