import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { IUserService } from 'src/domain/service/user.service';
import { LoginDto } from './dto/user.dto';
import { IUserModel } from 'src/domain/model/user.model';

@Controller({ path: 'user' })
@UseGuards(ThrottlerGuard)
export class UserController {
    constructor(
        @Inject(IUserService) private readonly userService: IUserService,
    ) {}

    @Throttle({ default: { limit: 5, ttl: 10000 } })
    @Post('init-admin')
    async initAdmin(): Promise<boolean> {
        return await this.userService.initAdmin();
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<IUserModel> {
        return await this.userService.login({
            email: loginDto.email,
            password: loginDto.password,
        });
    }
}
