import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './controller/guard/auth.guard';
import { DefaultUserService } from './domain/service/impl/user.service.default';
import { IUserService } from './domain/service/user.service';
import { ITokenRepo } from './domain/repo/token.repo';
import { IUserRepo } from './domain/repo/user.repo';
import { TokenMongoRepo } from './repo/mongodb/impl/token.mongo.repo';
import { UserMongoRepo } from './repo/mongodb/impl/user.mongo.repo';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './repo/mongodb/schema/role.schema';
import { Token, TokenSchema } from './repo/mongodb/schema/token.schema';
import { User, UserSchema } from './repo/mongodb/schema/user.schema';
import { RolesGuard } from './controller/guard/roles.guard';
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
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
})
export class GuardModule {}
