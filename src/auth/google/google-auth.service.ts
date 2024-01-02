import { Injectable } from '@nestjs/common';
import { UserService } from 'src/models/user/user.service';
import { SocialLoginInfoDto } from '../dto/social-login-info.dto';
import { User } from 'src/models/user/entities/user.entity';
import { Provider } from 'src/common/enums/provider.enum';

@Injectable()
export class GoogleAuthenticationService {
  constructor(private readonly userService: UserService) {}

  async validateAndSaveUser(
    socialLoginInfoDto: SocialLoginInfoDto,
  ): Promise<object | User> {
    const { email, refreshToken } = socialLoginInfoDto;

    const existingUser = await this.userService.findUserByEmail(email);

    if (existingUser) {
      if (existingUser.socialProvider !== Provider.GOOGLE) {
        return {
          existingUser: existingUser,
          msg: '해당 이메일을 사용중인 계정이 존재합니다.',
        };
      } else {
        const updateUserWithRefToken: User =
          await this.userService.updateSocialUserRefToken(
            existingUser.id,
            refreshToken,
          );
        return updateUserWithRefToken;
      }
    }

    const newUser = await this.userService.createSocialUser(socialLoginInfoDto);
    const updateUser = await this.userService.updateSocialUserInfo(newUser.id);

    return updateUser;
  }

  async findUserById(id: number) {
    const user = await this.userService.findUserById(id);
    return user;
  }
}
