import { Controller, Get, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { UserService } from '../domain/user.service';

@Controller('user')
@UseGuards(ThrottlerGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Throttle({ default: { limit: 10, ttl: 6000 } })
  @Get()
  async tryData(): Promise<string> {
    return await this.userService.getTitle();
  }
}
