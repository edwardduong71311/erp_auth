import { Injectable } from '@nestjs/common';
import { Movie } from './schema/movie.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserRepo {
  constructor(@InjectModel(Movie.name) private movieModel: Model<Movie>) {}

  async getUserData(): Promise<Movie[]> {
    return this.movieModel.find({ title: 'The Great Train Robbery' }).exec();
  }
}
