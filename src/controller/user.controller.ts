import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { IUserService } from 'src/domain/service/user.service';

@Controller('user')
@UseGuards(ThrottlerGuard)
export class UserController {
    constructor(
        @Inject(IUserService) private readonly userService: IUserService,
    ) {}

    @Throttle({ default: { limit: 10, ttl: 10000 } })
    @Get()
    async tryData(): Promise<string> {
        return await this.userService.getTitle();
    }
}
