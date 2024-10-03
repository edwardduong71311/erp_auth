import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { IUserRepo } from './domain/repo/user.repo';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UserMongoRepo } from './repo/mongodb/impl/user.mongo.repo';
import { DefaultUserService } from './domain/service/impl/user.service.default';
import { IUserService } from './domain/service/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './repo/mongodb/schema/user.schema';
import { Role, RoleSchema } from './repo/mongodb/schema/role.schema';
import { Token, TokenSchema } from './repo/mongodb/schema/token.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ITokenRepo } from './domain/repo/token.repo';
import { TokenMongoRepo } from './repo/mongodb/impl/token.mongo.repo';

@Module({
    imports: [
        ConfigModule.forRoot(),
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 10,
            },
        ]),
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Role.name, schema: RoleSchema },
            { name: Token.name, schema: TokenSchema },
        ]),
        JwtModule.register({
            global: true,
            secret: process.env.AUTH_JWT_CONSTANT,
        }),
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
            provide: ITokenRepo,
            useClass: TokenMongoRepo,
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class UserModule {}
