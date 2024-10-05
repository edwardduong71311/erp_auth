import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUserRepo } from 'src/domain/repo/user.repo';
import { IUserModel } from 'src/domain/model/user.model';
import { User } from '../schema/user.schema';
import { UserRole } from '../schema/user_role.schema';
import { Role } from 'src/controller/dto/role.enum';

@Injectable()
export class UserMongoRepo implements IUserRepo {
    constructor(
        @InjectModel(User.name) private userCollection: Model<User>,
        @InjectModel(UserRole.name) private userRoleCollection: Model<UserRole>,
    ) {}

    async checkAdmin(): Promise<boolean> {
        const data = await this.userCollection
            .findOne({ email: process.env.ADMIN_EMAIL })
            .exec();
        return !!data;
    }

    async createAdmin(info: IUserModel): Promise<boolean> {
        try {
            const user: User = {
                email: info.email,
                name: info.name,
                password: info.password,
                info: null,
            };
            await this.userCollection.create(user);

            const role: UserRole = {
                email: info.email,
                roles: [Role.Admin],
            };
            await this.userRoleCollection.create(role);
            return true;
        } catch (e) {
            return false;
        }
    }

    async getUserByEmail(email: string): Promise<IUserModel> {
        return this.userCollection.findOne({ email: email }).exec();
    }

    async getUserRoleByEmail(email: string): Promise<string[]> {
        const result = await this.userRoleCollection
            .findOne({ email: email })
            .exec();
        return result?.roles || [];
    }
}
