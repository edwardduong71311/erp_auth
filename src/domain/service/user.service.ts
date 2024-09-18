import { IUserModel } from '../model/user.model';

export interface IUserService {
    getUserByEmail(email: string): Promise<IUserModel>;
    initAdmin(): Promise<boolean>;
    login(user: IUserModel): Promise<IUserModel>;
}

export const IUserService = Symbol('IUserService');
