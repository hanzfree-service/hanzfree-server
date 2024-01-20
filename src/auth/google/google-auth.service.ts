import { Injectable } from '@nestjs/common';
import { UserService } from 'src/models/user/user.service';
import { SocialLoginInfoDto } from '../dto/social-login-info.dto';
import { User } from 'src/models/user/entities/user.entity';
import { Provider } from 'src/common/enums/provider.enum';
import { LocalAuthService } from '../local-auth/local-auth.service';

@Injectable()
export class GoogleAuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: LocalAuthService,
  ) {}

  async validateAndSaveUser(
    socialLoginInfoDto: SocialLoginInfoDto,
  ): Promise<object | User> {
    const { email } = socialLoginInfoDto;

    const existingUser = await this.userService.findUserByEmail(email);
    console.log('existingUser', existingUser);

    if (existingUser) {
      if (existingUser.socialProvider !== Provider.GOOGLE) {
        return {
          existingUser: existingUser,
          msg: '해당 이메일을 사용중인 계정이 존재합니다.',
        };
      } else {
        // TODO: refreshToken 업데이트
        // const updateUserWithRefToken: User =
        //   await this.userService.updateSocialUserRefToken(
        //     existingUser.id,
        //     refreshToken,
        //   );
        return existingUser;
      }
    }

    return this.userService.createSocialUser(socialLoginInfoDto);
  }

  async findUserById(id: number) {
    const user = await this.userService.findUserById(id);
    return user;
  }
}
