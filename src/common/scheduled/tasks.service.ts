import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from 'src/models/user/user.service';

@Injectable()
export class TasksService {
  constructor(private usersService: UserService) {}

  //
  @Cron(CronExpression.EVERY_MINUTE)
  async removeExpiredTokens() {
    const currentTime = new Date().getTime();
    const usersWithExpiredTokens =
      await this.usersService.findUsersWithExpiredTokens(currentTime);
    // console.log('list', usersWithExpiredTokens);
    for (const user of usersWithExpiredTokens) {
      if (user.currentRefreshToken) {
        await this.usersService.removeRefreshToken(user.id);
      }
    }
  }
}
