import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { DetailUserService } from 'src/services/users/DetailUser.service';

@Controller('user')
export class DetailUserController {
  constructor(private readonly detailUserService: DetailUserService) {}

  @Get('me') 
  async findById(@Headers('authorization') token: string) {
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    return this.detailUserService.findById(token);
  }
}