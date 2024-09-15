export interface IUserService {
    getTitle(): Promise<string>;
}

export const IUserService = Symbol('IUserService');
