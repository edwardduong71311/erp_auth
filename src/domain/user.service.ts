import { Injectable } from '@nestjs/common';
import { UserRepo } from 'src/repository/user.repo';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepo) {}

  async getTitle(): Promise<string> {
    const data = await this.userRepo.getUserData();
    return `${data.length}`;
  }
}
