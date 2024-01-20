import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { GoogleAuthenticationService } from './google-auth.service';
import { SocialLoginInfoDto } from '../dto/social-login-info.dto';
import { User } from 'src/models/user/entities/user.entity';

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
  // authorizationParams(): { [key: string]: string } {
  //   return {
  //     access_type: 'offline',
  //     prompt: 'select_account',
  //   };
  // }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    // done: VerifyCallback,
  ): Promise<object | User> {
    const { name, emails, provider, _json } = profile;

    // console.log('googgle-profile', profile);
    const socialLoginUserInfo: SocialLoginInfoDto = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      socialProvider: provider,
      externalId: profile.id,
      countryCode: _json.locale,
      // accessToken,
      // refreshToken,
    };

    // console.log('socialLoginUserInfo', socialLoginUserInfo);
    const user =
      await this.googleAuthService.validateAndSaveUser(socialLoginUserInfo);

    return user;
  }
}
