import { Module } from '@nestjs/common';
import { UserModule } from './app.user.module';
import { MongoModule } from './repo/mongodb/mongodb.module';

@Module({
    imports: [UserModule, MongoModule],
    providers: [],
})
export class AppModule {}
