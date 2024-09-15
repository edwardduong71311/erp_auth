import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MovieDocument = HydratedDocument<Movie>;

@Schema({ collection: 'movies' })
export class Movie {
    @Prop()
    title: string;

    @Prop()
    year: number;

    @Prop()
    plot: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
