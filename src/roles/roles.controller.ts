import { Body, Controller, Get, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './schemas/roles.schema';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Get()
  getRoles(): Promise<Role[]> {
    return this.roleService.getRoles();
  }

  @Post()
  createRole(@Body() body: CreateRoleDto): Promise<Role> {
    return this.roleService.createRole(body);
  }
}
