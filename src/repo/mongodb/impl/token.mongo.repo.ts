import { ITokenModel } from 'src/domain/model/token.model';
import { ITokenRepo } from 'src/domain/repo/token.repo';
import { Token, TokenInfo } from '../schema/token.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class TokenMongoRepo implements ITokenRepo {
    constructor(
        @InjectModel(Token.name) private tokenCollection: Model<Token>,
    ) {}

    async revokeToken(email: string): Promise<boolean> {
        try {
            await this.tokenCollection.deleteMany({ email: email });
            return true;
        } catch (e) {
            return false;
        }
    }

    async getTokenByEmail(email: string): Promise<ITokenModel> {
        return this.toModel(
            await this.tokenCollection.findOne({ email: email }).exec(),
        );
    }

    async saveToken(token: ITokenModel): Promise<boolean> {
        try {
            const info: Token = {
                email: token.email,
                token: token.token,
                createDt: token.createDt,
                info: {
                    host: token?.info.host,
                    device: token?.info.device,
                },
            };
            await this.tokenCollection.create(info);
            return true;
        } catch (e) {
            return false;
        }
    }

    toModel(entity: Token): ITokenModel {
        if (!entity) return null;

        return {
            email: entity.email,
            token: entity.token,
            createDt: entity.createDt,
            info: entity.info,
        };
    }
}
