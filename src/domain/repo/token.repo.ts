import { ITokenModel } from '../model/token.model';

export interface ITokenRepo {
    getTokenByEmail(email: string): Promise<ITokenModel>;
    saveToken(token: ITokenModel): Promise<boolean>;
    revokeToken(email: string): Promise<boolean>;
}

export const ITokenRepo = Symbol('ITokenRepo');
