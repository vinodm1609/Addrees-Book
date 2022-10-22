import { LoginDto } from './dto/login.dto';
import { IUser } from './interface/register.interface';
import { User, UserDocument } from './schema/user.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(createRegisterDto: CreateRegisterDto): Promise<IUser> {
    // check password and confirmpassword are match our not
    if (createRegisterDto.password !== createRegisterDto.confirmPassword) {
      throw new BadRequestException('password does not match');
    }

    //generate hash password

    const hashPassword = await bcrypt.hash(createRegisterDto.password, 10);
    createRegisterDto.password = hashPassword;
    return this.userModel.create(createRegisterDto);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userModel.findOne({ email: loginDto.email }).lean();
    if (!user) {
      // check the user are excites or not
      throw new BadRequestException('email not found');
    }

    // compare the password
    const password = await bcrypt.compare(loginDto.password, user.password);
    if (!password) {
      throw new BadRequestException('password does not match');
    }
    // delete the password
    delete user.password;

    // create accessToken for login
    const accessToken = this.jwtService.sign(user, {
      secret: process.env.SECRET_KEY,
    });
    return { accessToken };
  }
}
