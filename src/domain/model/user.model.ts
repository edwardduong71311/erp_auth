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
