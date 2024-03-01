import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from 'src/models/user/user.service';
import { LocalAuthService } from '../local-auth/local-auth.service';
import { InstagramAuthenticationService } from './instagram-auth.service';
// import { GoogleAuthGuard } from './google-auth.guard';

@Controller('auth/instagram')
export class InstagramAuthenticationController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: LocalAuthService,
    private readonly instagramService: InstagramAuthenticationService,
  ) {}

  // 인스타 로그인 성공 시, redirect를 수행할 라우트 핸들러
  @Get('/redirect')
  async handleRedirect(@Req() req: any, @Query('code') code: string) {
    console.log('insta login test', req.query, code);

    // this.instagramService.getInstagramUserToken(code);
    return true;
  }

  @Get('/token')
  async handleToken(@Req() req: any) {
    console.log('insta token test', req);

    return true;
  }
}
