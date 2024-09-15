import { Inject, Injectable } from '@nestjs/common';
import { IUserRepo } from '../../repo/user.repo';
import { IUserService } from '../user.service';

@Injectable()
export class DefaultUserService implements IUserService {
    constructor(@Inject(IUserRepo) private readonly userRepo: IUserRepo) {}

    async getTitle(): Promise<string> {
        const data = await this.userRepo.getTitle();
        return `${data.length}`;
    }
}
