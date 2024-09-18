import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { IUserRepo } from '../../repo/user.repo';
import { IUserService } from '../user.service';
import { IUserModel } from 'src/domain/model/user.model';
import {
    comparePassword,
    hashPassword,
} from 'src/domain/utility/password.helper';
import * as crypto from 'node:crypto';

@Injectable()
export class DefaultUserService implements IUserService {
    constructor(@Inject(IUserRepo) private readonly userRepo: IUserRepo) {}

    async login(user: IUserModel): Promise<IUserModel> {
        if (!user || !user.email || !user.password)
            throw new BadRequestException('User not found');

        const savedUser = await this.userRepo.getUserByEmail(user.email);
        if (
            !savedUser ||
            !(await comparePassword(user.password, savedUser.password))
        )
            throw new NotFoundException('User not found');

        return this.genDefaultUserModel(savedUser);
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
            name: '',
            email: '',
        };
        if (!param) return result;

        if (param.name) {
            result.name = param.name;
        }
        if (param.email) {
            result.email = param.email;
        }

        return result;
    }
}
