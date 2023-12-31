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

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const request = context.switchToHttp().getRequest();
      const access_token = request.cookies['access_token'];
      const user = await this.jwtService.verify(access_token);
      request.user = user;
      return user;
    } catch (err) {
      throw new UnauthorizedException('옹류이슴'); // 예외 처리 변경
    }
  }
}
