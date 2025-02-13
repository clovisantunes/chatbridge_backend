import { Injectable } from '@nestjs/common';
import prismaClient from 'src/Prisma';

@Injectable()
export class UserSessionService {
  private prismaClient = prismaClient;

  async setUserSector(number: string, sector: string) {
    if (!number || !sector) {
      throw new Error('Número e setor são obrigatórios.');
    }

    try {
      return await this.prismaClient.userSession.upsert({
        where: { number },
        update: { sector },
        create: { number, sector },
      });
    } catch (error) {
      throw new Error(`Erro ao definir o setor do usuário: ${error.message}`);
    }
  }

  async getUserSector(number: string) {
    if (!number) {
      throw new Error('Número é obrigatório.');
    }

    try {
      const session = await this.prismaClient.userSession.findUnique({
        where: { number },
      });
      return session?.sector || null;
    } catch (error) {
      throw new Error(`Erro ao buscar o setor do usuário: ${error.message}`);
    }
  }
}