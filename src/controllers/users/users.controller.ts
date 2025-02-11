import { Body, Controller, Get, Headers, Param, Post, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/app/interfaces/user.interface';
import { GetAllUserService } from 'src/services/users/getAllUsers.service';

@Controller('users')
export class UsersController {
    constructor(public readonly getAllUserService: GetAllUserService) {}

    @Get()
    async findAllUsers(@Headers('authorization') token: string): Promise<User[]> {
        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }

        if (token.startsWith('Bearer ')) {
            token = token.slice(7);
        } else {
            throw new UnauthorizedException('Invalid token format');
        }

        try {
            return await this.getAllUserService.findUserById(token);
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw new UnauthorizedException(error.message);
            } else if (error.message === 'Unauthorized') {
                throw new UnauthorizedException('User is not authorized to perform this action');
            } else {
                throw error;
            }
        }
    }
}
