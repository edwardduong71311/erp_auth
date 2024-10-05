import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserRoleDocument = HydratedDocument<UserRole>;

@Schema({ collection: 'user_role' })
export class UserRole {
    @Prop()
    email: string;

    @Prop()
    roles: string[];
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
