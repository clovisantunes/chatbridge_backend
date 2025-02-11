import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import prismaClient from 'src/Prisma';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from 'src/config/token';

@Injectable()
class DetailUserService {
  private validateToken(token: string): number {
    try {
      const decoded: any = jwt.verify(token, jwtConstants.secret);

      if (!decoded.id) {
        throw new UnauthorizedException('Invalid token payload');
      }

      return decoded.id; 
    } catch (error) {
      console.error('Token verification failed:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async findById(token: string): Promise<User> {
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    const userId = this.validateToken(token);

    const getUser = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!getUser) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return getUser;
  }
}

export { DetailUserService };