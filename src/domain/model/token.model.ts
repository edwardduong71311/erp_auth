export interface ITokenModel {
    token: string;
    email: string;
    createDt: number;
    info?: IRequestInfo;
}

export interface IRequestInfo {
    host?: string;
    device?: string;
}
