import { Injectable } from '@nestjs/common';
import { UserService } from 'src/models/user/user.service';
import { SocialLoginInfoDto } from '../dto/social-login-info.dto';
import { User } from 'src/models/user/entities/user.entity';
import { Provider } from 'src/common/enums/provider.enum';
import { LocalAuthService } from '../local-auth/local-auth.service';
import axios from 'axios';

@Injectable()
export class InstagramAuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: LocalAuthService,
  ) {}

  async getInstagramUserToken(code: string) {
    const formData = new URLSearchParams();
    formData.append('client_id', '923428659046986');
    formData.append('client_secret', '4b385f4aef958238d3ef3dd3b41c99fc');
    formData.append('grant_type', 'authorization_code');
    formData.append(
      'redirect_uri',
      'https://api.hanzfree.co.kr/api/auth/instagram/redirect',
    );
    formData.append('code', code);

    const res = await axios.post(
      'https://api.instagram.com/oauth/access_token',
      formData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return res.data;
  }

  async getInstagramUser(accessToken: string, user_id: string) {
    const res = await axios.get(
      `https://graph.instagram.com/7327583987290490?fields=id,username&access_token=${accessToken}`,
    );

    return res;
  }

  async validateAndSaveUser(instaLoginDto: any) {
    const { id, username } = instaLoginDto;
    console.log('id', id);
    console.log('username', username);

    // const existingUser = await this.userService.findUserByEmail(id);
    // // console.log('existingUser', existingUser);

    // if (existingUser) {
    //   if (existingUser.socialProvider !== Provider.INSTAGRAM) {
    //     return {
    //       existingUser: existingUser,
    //       msg: '해당 이메일을 사용중인 계정이 존재합니다.',
    //     };
    //   } else {
    //     // TODO: refreshToken 업데이트
    //     // const updateUserWithRefToken: User =
    //     //   await this.userService.updateSocialUserRefToken(
    //     //     existingUser.id,
    //     //     refreshToken,
    //     //   );
    //     return existingUser;
    //   }
    // }

    // return this.userService.createSocialUser(socialLoginInfoDto);
  }

  async findUserById(id: number) {
    const user = await this.userService.findUserById(id);
    return user;
  }
}
