import {
    Inject,
    Injectable,
    OnApplicationBootstrap,
    UnauthorizedException,
} from '@nestjs/common';
import { IUserRepo } from '../../repo/user.repo';
import { IUserService } from '../user.service';
import { ILoginModel, IUserModel } from 'src/domain/model/user.model';
import {
    comparePassword,
    generatePassword,
    hashPassword,
} from 'src/domain/utility/password.helper';
import { JwtService } from '@nestjs/jwt';
import { IRequestInfo, ITokenModel } from 'src/domain/model/token.model';
import { ITokenRepo } from 'src/domain/repo/token.repo';

@Injectable()
export class DefaultUserService
    implements IUserService, OnApplicationBootstrap
{
    constructor(
        @Inject(IUserRepo) private readonly userRepo: IUserRepo,
        @Inject(ITokenRepo) private readonly tokenRepo: ITokenRepo,
        private jwtService: JwtService,
    ) {}

    onApplicationBootstrap() {
        this.initAdmin();
    }

    async getTokenByEmail(email: string): Promise<ITokenModel> {
        return await this.tokenRepo.getTokenByEmail(email);
    }

    async login(
        user: IUserModel,
        requestInfo: IRequestInfo,
    ): Promise<ILoginModel> {
        if (!user || !user.email || !user.password)
            throw new UnauthorizedException('User not found');

        const savedUser = await this.userRepo.getUserByEmail(user.email);
        if (
            !savedUser ||
            !(await comparePassword(user.password, savedUser.password))
        )
            throw new UnauthorizedException('User not found');

        let token = await this.getTokenByEmail(user.email);
        if (token) {
            const checkRes = await this.checkToken(token.token);
            if (!checkRes) {
                token = await this.assignNewToken(
                    savedUser,
                    requestInfo.host,
                    requestInfo.device,
                );
            }
        } else {
            token = await this.assignNewToken(
                savedUser,
                requestInfo.host,
                requestInfo.device,
            );
        }

        return {
            email: savedUser.email,
            name: savedUser.name,
            token: token,
        };
    }

    async assignNewToken(
        user: IUserModel,
        host: string,
        device: string,
    ): Promise<ITokenModel> {
        const token = await this.createToken(user, host, device);
        await this.tokenRepo.revokeToken(user.email);
        await this.tokenRepo.saveToken(token);
        return token;
    }

    async checkToken(token: string): Promise<boolean> {
        try {
            await this.jwtService.verifyAsync(token, {
                secret: process.env.AUTH_JWT_CONSTANT,
            });
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async createToken(
        user: IUserModel,
        host: string,
        device: string,
    ): Promise<ITokenModel> {
        const payload = { email: user.email, createDt: Date.now() };
        const access_token = await this.jwtService.signAsync(payload, {
            expiresIn: '1h',
        });
        return {
            email: payload.email,
            token: access_token,
            createDt: payload.createDt,
            info: {
                host: host,
                device: device,
            },
        };
    }

    async initAdmin(): Promise<boolean> {
        const hasAdmin = await this.userRepo.checkAdmin();
        if (!hasAdmin) {
            const password = generatePassword();
            // TODO: Create Send email interface
            const model: IUserModel = {
                name: 'Admin',
                email: process.env.ADMIN_EMAIL,
                password: await hashPassword(password),
            };
            return await this.userRepo.createAdmin(model);
        }
        return Promise.resolve(true);
    }

    async getUserByEmail(email: string): Promise<IUserModel> {
        const data = await this.userRepo.getUserByEmail(email);
        return this.genDefaultUserModel(data);
    }

    genDefaultUserModel(param: any): IUserModel {
        const result: IUserModel = {
            name: param?.name || '',
            email: param?.email || '',
        };
        return result;
    }

    async getUserRoleByEmail(email: string): Promise<string[]> {
        return await this.userRepo.getUserRoleByEmail(email);
    }
}
