import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TokenDocument = HydratedDocument<Token>;

@Schema({ _id: false })
export class TokenInfo {
    @Prop({ required: true })
    host: string;

    @Prop({ required: true })
    device: string;
}

@Schema({ collection: 'token' })
export class Token {
    @Prop()
    token: string;

    @Prop()
    userId: string;

    @Prop()
    expiration: number;

    @Prop()
    createDt: number;

    @Prop({ required: true, type: TokenInfo })
    info: TokenInfo;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
