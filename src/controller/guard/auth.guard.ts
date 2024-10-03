import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ITokenModel } from 'src/domain/model/token.model';
import { IUserService } from 'src/domain/service/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        @Inject(IUserService) private readonly userService: IUserService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.AUTH_JWT_CONSTANT,
            });
            if (!payload['email']) throw new UnauthorizedException();

            const tokenInfo: ITokenModel =
                await this.userService.getTokenByEmail(payload['email']);
            if (!tokenInfo || tokenInfo.token !== token)
                throw new UnauthorizedException();

            request['user'] = payload;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
