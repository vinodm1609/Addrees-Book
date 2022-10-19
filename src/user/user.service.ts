import { IUser } from './interface/register.interface';
import { User } from './schema/user.schema';

import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRegisterDto } from './dto/register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  public async register(createRegisterDto: CreateRegisterDto): Promise<IUser> {
    return this.userModel.create(createRegisterDto);
  }
}
