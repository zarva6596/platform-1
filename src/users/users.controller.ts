import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/users.schema';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles-auth.decorator';
import { ValidationPipe } from '../pipes/validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  getUser(@Param('id') id: string): Promise<User> {
    return this.usersService.getUser(id);
  }

  @Roles('USER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  getAllUsers(@Query('email') email: string): Promise<User[]> {
    return email?.length
      ? this.usersService.findByEmail(email)
      : this.usersService.getAllUsers();
  }

  @UsePipes(ValidationPipe)
  @Post()
  createUser(@Body() CreateUser: CreateUserDto): Promise<User> {
    return this.usersService.createUser(CreateUser);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string): Promise<User> {
    return this.usersService.removeUser(id);
  }

  @Patch(':id')
  updateUser(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string) {
    return this.usersService.updateUser(id, updateUserDto);
  }
}
