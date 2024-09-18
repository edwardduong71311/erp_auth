export interface ITokenModel {
    token: string;
    userId: string;
    expiration: number;
    createDt: number;
    info: ITokenInfoModel;
}

export interface ITokenInfoModel {
    host?: string;
    device?: string;
}
