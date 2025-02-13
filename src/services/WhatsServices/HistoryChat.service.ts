import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HistoryChatService {
  private readonly logger = new Logger(HistoryChatService.name);  // Adicionando o Logger

  constructor(private readonly prisma: PrismaService) {}  // Injeção do PrismaService

  // Método para registrar a mensagem no histórico
  public async saveChatHistory(number: string, sector: string, message: string) {
    try {
      await this.prisma.historyChat.create({
        data: {
          numero: number,  // Certifique-se de que 'numero' está sendo passado corretamente
          setor: sector,  // Certifique-se de que 'setor' está sendo passado corretamente
          mensagem: message,  // Certifique-se de que 'mensagem' está sendo passado corretamente
        },
      });
      this.logger.log(`Mensagem registrada no histórico com sucesso.`);
    } catch (error) {
      this.logger.error(`Erro ao registrar a mensagem no histórico: ${error.message}`);
      throw error;
    }
  }
  public async getAllChatHistory() {
    try {
      const history = await this.prisma.historyChat.findMany();
      this.logger.log(`Histórico de mensagens recuperado com sucesso.`);
      return history;
    } catch (error) {
      this.logger.error(`Erro ao recuperar o histórico de mensagens: ${error.message}`);
      throw error;
    }
  }
}