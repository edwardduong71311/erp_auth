import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { IUserRepo } from './domain/repo/user.repo';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UserMongoRepo } from './repo/mongodb/impl/user.mongo.repo';
import { DefaultUserService } from './domain/service/impl/user.service.default';
import { IUserService } from './domain/service/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './repo/mongodb/schema/user.schema';
import { Role, RoleSchema } from './repo/mongodb/schema/role.schema';
import { Token, TokenSchema } from './repo/mongodb/schema/token.schema';
import { ITokenRepo } from './domain/repo/token.repo';
import { TokenMongoRepo } from './repo/mongodb/impl/token.mongo.repo';
import {
    UserRole,
    UserRoleSchema,
} from './repo/mongodb/schema/user_role.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Role.name, schema: RoleSchema },
            { name: Token.name, schema: TokenSchema },
            { name: UserRole.name, schema: UserRoleSchema },
        ]),
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
    exports: [IUserService],
})
export class UserModule {}
