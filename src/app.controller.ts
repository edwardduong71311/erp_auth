import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller()
@UseGuards(ThrottlerGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Throttle({ default: { limit: 10, ttl: 6000 } })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
