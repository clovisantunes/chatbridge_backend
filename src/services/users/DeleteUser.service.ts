import { Injectable, UnauthorizedException } from '@nestjs/common';
import prismaClient from 'src/Prisma';

@Injectable()
export class DeleteUserService {
  async execute(id: number, userIdFromToken: number): Promise<any> {
    const userFromToken = await prismaClient.user.findUnique({
      where: {
        id: userIdFromToken,
      },
    });

    if (!userFromToken || !userFromToken.admin) {
      throw new UnauthorizedException(
        'Apenas administradores podem deletar usuários.',
      );
    }

    const deleteUser = await prismaClient.user.delete({
      where: {
        id: id,
      },
    });
      return deleteUser;
    
  }
}