import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as process from 'process';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(body: CreateUserDto) {
    const user = await this.validateUser(body);
    return this.generateToken(user);
  }

  async registration(body: CreateUserDto) {
    const candidate = await this.userService.findOneByEmail(body.email);

    if (candidate) {
      throw new HttpException('this email is exist', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(body.password, 5);
    const user = await this.userService.createUser({
      ...body,
      password: hashPassword,
    });

    return this.generateToken(user);
  }

  private async generateToken(user) {
    const payload = { email: user.email, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        secret:
          process.env.JWT_REFRESH_SECRET || 'jwt_refresh_token_secret_key',
        expiresIn: 60,
      }),
    };
  }

  private async validateUser(body: CreateUserDto) {
    const user = await this.userService.findOneByEmail(body.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordEquals = await bcrypt.compare(body.password, user.password);
    if (user && passwordEquals) {
      return user;
    }

    throw new UnauthorizedException({
      message: 'Email or Password is not correct',
    });
  }

  async refreshToken(token: string) {
    const user = this.jwtService.decode(token);
    return this.generateToken(user);
  }
}
