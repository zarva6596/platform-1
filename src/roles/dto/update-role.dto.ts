import { IsArray } from 'class-validator';

export class UpdateRoleDto {
  @IsArray()
  users: [];
}
