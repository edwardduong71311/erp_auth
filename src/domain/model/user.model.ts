import { ITokenModel } from './token.model';

export interface ILoginModel {
    name: string;
    email: string;
    token: ITokenModel;
}

export interface IUserModel {
    name?: string;
    email: string;
    password?: string;
    info?: IUserInfoModel;
}

export interface IUserInfoModel {
    facebook: string;
    linkedin: string;
}
