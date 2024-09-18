import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ _id: false })
export class Verification {
    @Prop({ required: true })
    path: string;

    @Prop({ required: false })
    feature: string;
}

@Schema({ collection: 'role' })
export class Role {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop({ required: true, type: Verification })
    verification: Verification;

    @Prop()
    users: string[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
