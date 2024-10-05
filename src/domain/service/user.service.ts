import { IRequestInfo, ITokenModel } from '../model/token.model';
import { ILoginModel, IUserModel } from '../model/user.model';

export interface IUserService {
    getUserByEmail(email: string): Promise<IUserModel>;
    getTokenByEmail(email: string): Promise<ITokenModel>;
    getUserRoleByEmail(email: string): Promise<string[]>;
    initAdmin(): Promise<boolean>;
    login(user: IUserModel, requestInfo: IRequestInfo): Promise<ILoginModel>;
}

export const IUserService = Symbol('IUserService');
