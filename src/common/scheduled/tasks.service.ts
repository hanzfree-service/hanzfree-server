import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TasksService {
  constructor(private usersService: UsersService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async removeExpiredTokens() {
    const currentTime = new Date().getTime();
    const usersWithExpiredTokens =
      await this.usersService.findUsersWithExpiredTokens(currentTime);
    console.log(usersWithExpiredTokens);
    for (const user of usersWithExpiredTokens) {
      if (user.currentRefreshToken) {
        await this.usersService.removeRefreshToken(user.user_idx);
      }
    }
  }
}
