import { Injectable } from '@nestjs/common';
import { Movie } from '../schema/movie.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUserRepo } from 'src/domain/repo/user.repo';
import { IMovie } from 'src/domain/model/movie';

@Injectable()
export class UserMongoRepo implements IUserRepo {
    constructor(@InjectModel(Movie.name) private movieModel: Model<Movie>) {}

    async getTitle(): Promise<IMovie[]> {
        return this.movieModel
            .find({ title: 'The Great Train Robbery' })
            .exec();
    }
}
