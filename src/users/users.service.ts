import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModule: Model<UserDocument>,
    private roleService: RolesService,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userModule.find().exec();
  }

  async getUser(id): Promise<User> {
    try {
      return await this.userModule.findById(id).populate('role');
    } catch (e) {
      throw new NotFoundException('user not found');
    }
  }

  async findByEmail(email): Promise<User[]> {
    return this.userModule.find({ email: email }).populate('role').exec();
  }

  async findOneByEmail(email): Promise<User> {
    return this.userModule.findOne({ email: email }).populate('role').exec();
  }

  async createUser(body): Promise<User> {
    try {
      const role = await this.roleService.getRoleByValue(body.role);
      const newUser = await new this.userModule({
        ...body,
        role: role.value,
      });
      await this.roleService.addUser(role.value, newUser._id);
      return await newUser.save();
    } catch (e) {
      /* TODO */
      throw new NotFoundException('something went wrong');
    }
  }

  async removeUser(id): Promise<User> {
    await this.getUser(id);
    return this.userModule.findByIdAndRemove(id);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    await this.getUser(id);
    return this.userModule.findByIdAndUpdate(id, updateUserDto);
  }
}
