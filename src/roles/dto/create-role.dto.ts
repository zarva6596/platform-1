import { IsArray, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  value: string;

  @IsString()
  description: string;

  @IsArray()
  users: [];
}
