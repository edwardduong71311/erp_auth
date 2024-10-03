import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepo } from '../../repo/user.repo';
import { IUserService } from '../user.service';
import { ILoginModel, IUserModel } from 'src/domain/model/user.model';
import {
    comparePassword,
    hashPassword,
} from 'src/domain/utility/password.helper';
import * as crypto from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import { IRequestInfo, ITokenModel } from 'src/domain/model/token.model';
import { ITokenRepo } from 'src/domain/repo/token.repo';

@Injectable()
export class DefaultUserService implements IUserService {
    constructor(
        @Inject(IUserRepo) private readonly userRepo: IUserRepo,
        @Inject(ITokenRepo) private readonly tokenRepo: ITokenRepo,
        private jwtService: JwtService,
    ) {}

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
        // TODO: Verify token and Refresh if possible
        if (!token) {
            token = await this.createToken(savedUser, requestInfo);
            this.tokenRepo.saveToken(token);
        }

        return {
            email: savedUser.email,
            name: savedUser.name,
            token: token,
        };
    }

    async createToken(
        user: IUserModel,
        requestInfo: IRequestInfo,
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
                host: requestInfo.host,
                device: requestInfo.device,
            },
        };
    }

    async initAdmin(): Promise<boolean> {
        const hasAdmin = await this.userRepo.checkAdmin();
        if (!hasAdmin) {
            const password = crypto.randomBytes(20).toString('hex');
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
}
