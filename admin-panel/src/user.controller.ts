import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Req,
  Render,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.model';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  @Get('panel')
  @Render('panel.hbs')
  async getPanel(@Req() req) {
    const users = await this.userService.getUsers();
    return { users };
  }
  @Get()
  async getUsers(@Req() request: Request): Promise<User[]> {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    console.log(data);
    return this.userService.getUsers();
  }

  @Patch(':id/blocked')
  async blockUser(@Param('id') id: number): Promise<User> {
    return this.userService.blockUser(id);
  }

  @Patch(':id/unblocked')
  async unblockUser(@Param('id') id: number): Promise<User> {
    return this.userService.unblockUser(id);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
