import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // 가드가 필요한 역할을 지정하지 않은 경우, 기본적으로 접근을 허용합니다.
    }

    const { user } = context.switchToHttp().getRequest();
    console.log('user: ', user);
    console.log('user.role: ', user.role);
    console.log('requiredRoles: ', requiredRoles);
    console.log('requiredRoles.some: ', requiredRoles.includes(user.role));

    // 사용자가 필요한 역할 중 하나라도 가지고 있는지 확인합니다.
    return requiredRoles.includes(user.role);
  }
}
