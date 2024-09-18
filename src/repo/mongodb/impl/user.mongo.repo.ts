import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUserRepo } from 'src/domain/repo/user.repo';
import { IUserModel } from 'src/domain/model/user.model';
import { User } from '../schema/user.schema';

@Injectable()
export class UserMongoRepo implements IUserRepo {
    constructor(@InjectModel(User.name) private userCollection: Model<User>) {}

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
            return true;
        } catch (e) {
            return false;
        }
    }

    async getUserByEmail(email: string): Promise<IUserModel> {
        return this.userCollection.findOne({ email: email }).exec();
    }
}
