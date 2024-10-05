import {
    Body,
    Controller,
    Get,
    Inject,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

import { IUserService } from 'src/domain/service/user.service';
import { LoginDto } from './dto/user.dto';
import { IUserModel } from 'src/domain/model/user.model';
import { AuthGuard } from './guard/auth.guard';

@Controller({ path: 'user' })
@UseGuards(ThrottlerGuard)
export class UserController {
    constructor(
        @Inject(IUserService) private readonly userService: IUserService,
    ) {}

    // @Throttle({ default: { limit: 5, ttl: 10000 } })
    // @Post('init-admin')
    // async initAdmin(): Promise<boolean> {
    //     return await this.userService.initAdmin();
    // }

    @UseGuards(AuthGuard)
    @Get()
    test(): string {
        return 'ok';
    }

    @Post('login')
    async login(
        @Req() req: Request,
        @Body() loginDto: LoginDto,
    ): Promise<IUserModel> {
        return await this.userService.login(
            {
                email: loginDto.email,
                password: loginDto.password,
            },
            {
                host: req.hostname,
                device: req.headers['user-agent'],
            },
        );
    }
}
