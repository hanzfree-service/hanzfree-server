// import { Injectable } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt-auth') {}

// 쿠키를 통해
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LocalAuthService } from './local-auth/local-auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: LocalAuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();

    try {
      const accessToken = request.cookies['access_token'];

      // console.log('accessToken', accessToken);

      const user = await this.jwtService.verify(accessToken);

      request.user = user;
      return user;
    } catch (err) {
      // access_token이 만료된 경우
      if (err.name === 'TokenExpiredError') {
        const refreshToken = request.cookies['refresh_token'];

        if (!refreshToken) {
          // refresh_token도 없는 경우
          throw new UnauthorizedException('Authentication required');
        }

        try {
          // refresh_token 검증 및 새로운 access_token 발급
          const newAccessToken = (await this.authService.refresh(refreshToken))
            .accessToken;
          // 새로운 access_token으로 사용자 정보 가져오기

          const user = await this.jwtService.verify(newAccessToken);
          request.user = user;

          // 새로운 access_token을 쿠키에 설정
          request.res.cookie('access_token', newAccessToken, {
            httpOnly: true,
          });
          return user;
        } catch (refreshErr) {
          // refresh_token 검증 실패

          throw new UnauthorizedException('Authentication required');
        }
      } else {
        // 그 외의 오류
        throw new UnauthorizedException('Invalid token');
      }
    }
  }
}
