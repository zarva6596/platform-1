import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './schemas/roles.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModule: Model<RoleDocument>,
  ) {}

  async getRoles(): Promise<Role[]> {
    return this.roleModule.find().exec();
  }

  async createRole(body): Promise<Role> {
    try {
      const newRole = await new this.roleModule(body).populate('users');
      return await newRole.save();
    } catch (e) {
      /* TODO */
      throw new NotFoundException('dont create role');
    }
  }

  async getRoleByValue(value) {
    return await this.roleModule.findOne({ value }).exec();
  }
}
