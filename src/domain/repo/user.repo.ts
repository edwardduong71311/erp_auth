import { IMovie } from '../model/movie';

export interface IUserRepo {
    getTitle(): Promise<IMovie[]>;
}

export const IUserRepo = Symbol('IUserRepo');
