// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable } from '@nestjs/common';
// import { jwtConstants } from './constants';
// import { UsersService } from 'src/users/users.service';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private readonly usersService: UsersService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: jwtConstants.secret,
//     });
//   }

//   async validate(payload: any) {
//     // return { user_idx: payload.sub, username: payload.username };

//     // const user = await this.usersService.findOne(payload.username);

//     const user = await this.usersService.findId(payload.sub);

//     return {
//       user_idx: payload.sub,
//       username: payload.username,
//       role: user.role,
//     };
//   }
// }

// 쿠키를 통해
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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
      return false;
    }
  }
}

// @Injectable()
// export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt-auth') {
//   constructor(
//     private readonly usersService: UsersService,
//     private readonly jwtService: JwtService,
//     private readonly configService: ConfigService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         (request: Request) => {
//           return request?.cookies?.['access_token'];
//         },
//       ]),
//       secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
//       passReqToCallback: true,
//     });
//   }

//   async validate(req: Request, payload: any) {
//     try {
//       console.log('req', req);
//       const accessToken = req.cookies['access_token'];
//       console.log('accessToken', accessToken);
//       if (!accessToken) {
//         throw new Error('No access token found in cookies');
//       }
//       // const user = await this.usersService.findId(payload.user_idx);
//       const user = await this.jwtService.verify(accessToken);
//       return user;
//     } catch (err) {
//       return false;
//     }
//   }
// }
