import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from 'src/models/user/user.service';
import { LocalAuthService } from '../local-auth/local-auth.service';
import { GoogleAuthGuard } from './google-auth.guard';

@Controller('auth/google')
export class GoogleAuthenticationController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: LocalAuthService,
  ) {}

  // login 라우트 핸들러
  @Get('/login')
  @UseGuards(GoogleAuthGuard)
  async handleLogin(
    @Query('redirect') redirect: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('redirect', redirect);
    const user = req.user;
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
      message: 'google login success',
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }

  // // login 성공 시, redirect를 수행할 라우트 핸들러
  // @Get('/redirect')
  // @UseGuards(GoogleAuthGuard)
  // async handleRedirect(@Req() req: any) {
  //   console.log('in redirect');
  //   return req.user;
  // }

  // session 저장에 따른 유저 객체 인증/인가 테스트
  @Get('/status')
  async user(@Req() req: any) {
    if (req.user) {
      console.log(req.user, 'Authenticated User');
      return {
        msg: 'Authenticated',
      };
    } else {
      console.log(req.user, 'User cannot found');
      return {
        msg: 'Not Authenticated',
      };
    }
  }
}
