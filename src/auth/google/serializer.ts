import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { GoogleAuthenticationService } from './google-auth.service';
import { User } from 'src/models/user/entities/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly googleAuthService: GoogleAuthenticationService) {
    super();
  }

  async serializeUser(
    user: User,
    done: (err: any, user?: any) => void,
  ): Promise<any> {
    console.log(user, 'serializeUser'); // 테스트 시 확인
    done(null, user);
  }

  async deserializeUser(
    payload: any,
    done: (err: any, user?: any) => void,
  ): Promise<any> {
    const user = await this.googleAuthService.findUserById(payload.id);
    console.log(user, 'deserializeUser'); // 테스트 시 확인
    return user ? done(null, user) : done(null, null);
  }
}
