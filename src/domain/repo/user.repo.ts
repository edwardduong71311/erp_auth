import { IUserModel } from '../model/user.model';

export interface IUserRepo {
    getUserByEmail(email: string): Promise<IUserModel>;
    checkAdmin(): Promise<boolean>;
    createAdmin(info: IUserModel): Promise<boolean>;
}

export const IUserRepo = Symbol('IUserRepo');
