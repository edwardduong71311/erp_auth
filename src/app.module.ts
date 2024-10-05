import { Module } from '@nestjs/common';
import { UserModule } from './app.user.module';
import { MongoModule } from './repo/mongodb/mongodb.module';
import { GuardModule } from './app.guard.module';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { TestModule } from './app.test.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
    imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
            global: true,
            secret: process.env.AUTH_JWT_CONSTANT,
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 1000,
                limit: 10,
            },
        ]),
        MongoModule,
        GuardModule,
        UserModule,
        TestModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
