import { Body, Controller, Inject, Post, Req } from '@nestjs/common';
import { Request } from 'express';

import { IUserService } from 'src/domain/service/user.service';
import { LoginDto } from './dto/user.dto';
import { IUserModel } from 'src/domain/model/user.model';
import { Public } from './guard/auth.guard';

@Controller({ path: 'user' })
export class UserController {
    constructor(
        @Inject(IUserService) private readonly userService: IUserService,
    ) {}

    @Public()
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
