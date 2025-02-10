import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from 'src/app/interfaces/user.interface';
import { GetAllUserService } from 'src/services/users/getAllUsers.service';

@Controller('users')
export class UsersController {
    constructor(public readonly getAllUserService: GetAllUserService) {}

  @Get()
 async findAll(): Promise<{ data: User[] }> {
    const users = await this.getAllUserService.findAll();
    return {
        data: users,
    };
  } 
}
