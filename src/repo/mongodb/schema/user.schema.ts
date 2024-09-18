import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ _id: false })
export class UserInfo {
    @Prop()
    facebook: string;

    @Prop()
    linkedin: string;
}

@Schema({ collection: 'user' })
export class User {
    @Prop()
    name: string;

    @Prop()
    password: string;

    @Prop()
    email: string;

    @Prop({ required: false, type: UserInfo })
    info: UserInfo;
}

export const UserSchema = SchemaFactory.createForClass(User);
