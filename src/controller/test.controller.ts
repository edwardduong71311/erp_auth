import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { Role } from './dto/role.enum';
import { Roles } from './guard/roles.guard';

@Controller({ path: 'test' })
export class TestController {
    constructor() {}

    @Roles(Role.Admin)
    @Get('1')
    get1(@Req() req: Request): string {
        return 'ok 1';
    }

    @Roles(Role.User)
    @Get('2')
    get2(@Req() req: Request): string {
        return 'ok 2';
    }
}
