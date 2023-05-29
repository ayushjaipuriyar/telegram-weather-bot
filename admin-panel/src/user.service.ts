import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { Admin } from './admin.model';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
  ) {}

  async createAdmin(createUserDto: CreateUserDto): Promise<Admin> {
    const admin = new this.adminModel(createUserDto);
    return admin.save();
  }

  async getUsers() {
    return this.userModel.find().exec();
  }

  async blockUser(id: number): Promise<User> {
    const user = await this.userModel
      .findOneAndUpdate({ id }, { blocked: true }, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async unblockUser(id: number): Promise<User> {
    const user = await this.userModel
      .findOneAndUpdate({ id }, { blocked: false }, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async deleteUser(id: number) {
    const result = await this.userModel.deleteOne({ id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async validateAdmin(
    username: string,
    password: string,
  ): Promise<Admin | null> {
    const admin = await this.adminModel.findOne({ username }).exec();
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return admin;
  }

  async findByUsername(username: string): Promise<Admin | null> {
    const admin = await this.adminModel.findOne({ username }).exec();
    return admin;
  }
}
