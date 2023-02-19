import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email field must have be email' })
  @IsString({ message: 'Email must have be a string' })
  readonly email: string;

  @IsString({ message: 'Password must have be a string' })
  @Length(6, 16, { message: 'Password length min - 6, max - 16' })
  readonly password: string;

  @IsString()
  readonly name: string;
}
