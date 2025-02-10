import { Body, Controller, Post } from "@nestjs/common";
import { User } from "src/app/interfaces/user.interface";
import { CreateUserService } from "src/services/users/CreateUser.service";



@Controller('users')
export class CreateUser {
  constructor(public readonly createUserService: CreateUserService) {}

  @Post('create') 
  async create(@Body() user: User): Promise<{ message: string; data: User }> {
    try {
      const createdUser = await this.createUserService.execute(user);
      return {
        message: 'User created successfully',
        data: createdUser,
      };
    } catch (error) {
      return {
        message: error.message || 'An error occurred while creating the user',
        data: null,
      };
    }
  }
}
