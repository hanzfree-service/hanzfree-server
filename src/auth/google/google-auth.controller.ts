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
  // @UseGuards(GoogleAuthGuard)
  async handleLogin(
    @Query('from') from: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('from in login', from);
    req.session.from = from;
    res.redirect('/api/auth/google/redirect');
  }

  // login 성공 시, redirect를 수행할 라우트 핸들러
  @Get('/redirect')
  @UseGuards(GoogleAuthGuard)
  async handleRedirect(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const from = req.session.from;
    console.log('from in redirect', from);
    const user = req.user;
    const access_token = await this.authService.generateAccessToken(user);
    const refresh_token = await this.authService.generateRefreshToken(user);

    // refresh token DB에 저장
    await this.userService.setCurrentRefreshToken(refresh_token, user.id);

    res.setHeader('Authorization', 'Bearer ' + [access_token, refresh_token]);
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

    const responseData = {
      email: user.email,
    };

    // 소셜 로그인 정보 정상적으로 처리 후, 클라이언트로 redirect
    // if (from !== 'undefined') {
    //   res.redirect(`${process.env.CLIENT_URL}/${from}`);
    // } else {
    //   res.redirect(`${process.env.CLIENT_URL}`);
    // }

    return res.redirect(`${process.env.CLIENT_URL}`);
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
