import { Controller, Get, Inject, UseGuards, Version } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { IUserService } from 'src/domain/service/user.service';

@Controller({
    path: 'user',
    version: '2',
})
@UseGuards(ThrottlerGuard)
export class UserController {
    constructor(
        @Inject(IUserService) private readonly userService: IUserService,
    ) {}

    @Throttle({ default: { limit: 10, ttl: 10000 } })
    @Version('1')
    @Get()
    getTitleV1(): string {
        return 'Version 1';
    }

    @Throttle({ default: { limit: 10, ttl: 10000 } })
    @Version('2')
    @Get()
    async getTitleV2(): Promise<string> {
        return await this.userService.getTitle();
    }
}
