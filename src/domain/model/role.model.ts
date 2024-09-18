export interface IRoleModel {
    name: string;
    description?: string;
    verification: IVerificationModel;
    users?: string[];
}

export interface IVerificationModel {
    path: string;
    feature: string;
}
