import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UserController } from './controller/user.controller';
import { UserService } from './domain/user.service';
import { UserRepo } from './repository/user.repo';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './repository/schema/movie.schema';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 6000,
        limit: 10,
      },
    ]),
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepo,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class UserModule {}
