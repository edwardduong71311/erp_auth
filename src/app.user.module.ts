import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { IUserRepo } from './domain/repo/user.repo';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UserMongoRepo } from './repo/mongodb/impl/user.mongo.repo';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './repo/mongodb/schema/movie.schema';
import { DefaultUserService } from './domain/service/impl/user.service.default';
import { IUserService } from './domain/service/user.service';

@Module({
    imports: [
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 10,
            },
        ]),
        MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    ],
    controllers: [UserController],
    providers: [
        {
            provide: IUserService,
            useClass: DefaultUserService,
        },
        {
            provide: IUserRepo,
            useClass: UserMongoRepo,
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class UserModule {}
