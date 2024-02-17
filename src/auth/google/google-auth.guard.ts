import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor() {
    super();
  }

  private static activate = false;
  private static redirect;

  async canActivate(context: ExecutionContext) {
    if (!GoogleAuthGuard.activate) {
      GoogleAuthGuard.redirect = context.switchToHttp().getRequest().query.from;
      GoogleAuthGuard.activate = true;
    }

    const activate = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    context.getArgs()[0]['redirect'] = GoogleAuthGuard.redirect;

    await super.logIn(request);
    GoogleAuthGuard.activate = false;
    return activate;
  }
}
