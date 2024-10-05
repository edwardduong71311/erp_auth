import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './controller/guard/auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './repo/mongodb/schema/role.schema';
import { Token, TokenSchema } from './repo/mongodb/schema/token.schema';
import { User, UserSchema } from './repo/mongodb/schema/user.schema';
import { RolesGuard } from './controller/guard/roles.guard';
import {
    UserRole,
    UserRoleSchema,
} from './repo/mongodb/schema/user_role.schema';
import { UserModule } from './app.user.module';

@Module({
    imports: [
        UserModule,
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Role.name, schema: RoleSchema },
            { name: Token.name, schema: TokenSchema },
            { name: UserRole.name, schema: UserRoleSchema },
        ]),
    ],
    providers: [
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
