import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { GoogleAuthenticationService } from './google-auth.service';
import { SocialLoginInfoDto } from '../dto/social-login-info.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly googleAuthService: GoogleAuthenticationService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: [process.env.GOOGLE_SCOPE_PROFILE, process.env.GOOGLE_SCOPE_EMAIL],
    });
  }

  // refreshToken을 얻고 싶다면 해당 메서드 설정 필수
  authorizationParams(): { [key: string]: string } {
    return {
      access_type: 'offline',
      prompt: 'select_account',
    };
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { name, emails, provider } = profile;
    const socialLoginUserInfo: SocialLoginInfoDto = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      socialProvider: provider,
      externalId: profile.id,
      accessToken,
      refreshToken,
    };
    try {
      const user =
        await this.googleAuthService.validateAndSaveUser(socialLoginUserInfo);
      console.log(user, 'strategy');

      // 3번째 인자로 accessToken을 담아줌으로써, login 요청마다 현재 로그인 상태에 대한 유효성을 검증 받도록 한다.
      done(null, user, accessToken);
    } catch (err) {
      done(err, false);
    }
  }
}
