import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GetSectorMessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async getMessagesBySector(token: string) {
    try {
      // Decodifica o token e obtém os dados do usuário
      const decoded = this.jwtService.decode(token) as { sector: string };
      
      if (!decoded || !decoded.sector) {
        throw new UnauthorizedException('Token inválido ou setor não encontrado.');
      }

      const userSector = decoded.sector;

      // Busca as mensagens apenas do setor do atendente
      const messages = await this.prisma.messageTecnico.findMany({
        where: {
          user: {
            setor: userSector,
          },
        },
        include: {
          user: true, // Retorna também os dados do usuário que enviou a mensagem
        },
      });

      return messages;

    } catch (error) {
      throw new UnauthorizedException('Erro ao validar o token.');
    }
  }
}
