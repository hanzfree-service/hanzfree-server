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

  // 구글 로그인 성공 시, redirect를 수행할 라우트 핸들러
  @Get('/redirect')
  @UseGuards(GoogleAuthGuard)
  async handleRedirect(@Req() req: any, @Res() res: Response) {
    const user = req.user;
    const access_token = await this.authService.generateAccessToken(user);
    const refresh_token = await this.authService.generateRefreshToken(user);

    // refresh token DB에 저장
    await this.userService.setCurrentRefreshToken(refresh_token, user.id);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      ...(process.env.NODE_ENV === 'production' && {
        sameSite: 'none',
        secure: true,
        domain: '.hanzfree.co.kr',
      }),
    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      ...(process.env.NODE_ENV === 'production' && {
        sameSite: 'none',
        secure: true,
        domain: '.hanzfree.co.kr',
      }),
    });

    if (req.redirect !== 'undefined') {
      return res.redirect(`${process.env.CLIENT_URL}/${req.redirect}`);
    } else {
      return res.redirect(`${process.env.CLIENT_URL}`);
    }
  }

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
