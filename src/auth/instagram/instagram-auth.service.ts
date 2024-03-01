import { Injectable } from '@nestjs/common';
import { UserService } from 'src/models/user/user.service';
import { SocialLoginInfoDto } from '../dto/social-login-info.dto';
import { User } from 'src/models/user/entities/user.entity';
import { Provider } from 'src/common/enums/provider.enum';
import { LocalAuthService } from '../local-auth/local-auth.service';
import axios from 'axios';
import cheerio from 'cheerio';

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

    const { id, username } = res.data;

    this.getProfile(username)
      .then((profileInfo) => {
        console.log('profileInfo', profileInfo);
        if (profileInfo) {
          console.log('프로필 정보', profileInfo);
          this.validateAndSaveUser(profileInfo)
            .then(() => {
              console.log('사용자 프로필을 유효하게 검증하고 저장했습니다.');
            })
            .catch((error) => {
              console.error('Error during validation and saving:', error);
            });
        } else {
          console.log('프로필 이미지를 가져올 수 없습니다.');
        }
      })
      .catch((error) => console.error('Error:', error));

    return res.data;
  }

  async validateAndSaveUser(instaLoginDto: any) {
    const { name, profileImageUrl } = instaLoginDto;
    console.log('name', name);
    console.log('profileImageUrl', profileImageUrl);

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

  async getProfile(username) {
    try {
      const response = await axios.get(
        `https://www.instagram.com/${username}/`,
      );
      const $ = cheerio.load(response.data);
      console.log('$', $);
      console.log('response', response.status);

      const fullName = $('meta[property="og:title"]').attr('content');
      // .split('•')[0];
      console.log('fullName', fullName);
      const _username = fullName.split(' ')[0].trim();
      console.log('_username', _username);
      const userId = fullName.split(' ')[1].trim().slice(2).slice(0, -1);
      console.log('userId', userId);

      const profileImageUrl = $('meta[property="og:image"]').attr('content');
      console.log('profileImageUrl', profileImageUrl);
      return { name: _username || userId, profileImageUrl };
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  async findUserById(id: number) {
    const user = await this.userService.findUserById(id);
    return user;
  }
}
