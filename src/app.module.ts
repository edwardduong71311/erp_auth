import { Module } from '@nestjs/common';
import { UserModule } from './app.user.module';
import { MongoModule } from './repo/mongodb/mongodb.module';

@Module({
    imports: [MongoModule, UserModule],
    providers: [],
})
export class AppModule {}
