import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User, UserDocument } from '../../user/schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];

    // verify the token
    const data = this.jwtService.verify(token, {
      secret: process.env.SECRET_KEY,
    });
    if (!data.email) {
      return false;
    }

    const user = await this.userModel.findOne({ email: data.email }).lean();

    request.user = user;

    if (user) {
      return true;
    }

    return false;
  }
}
