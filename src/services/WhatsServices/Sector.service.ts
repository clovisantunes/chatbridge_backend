import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { WhatsAppService } from 'src/services/WhatsServices/Send.service';
import prismaClient from 'src/Prisma';

@Injectable()
export class SectorService {
  private readonly logger = new Logger(SectorService.name);
  private prismaClient = prismaClient;

  constructor(
    @Inject(forwardRef(() => WhatsAppService))
    private readonly whatsAppService: WhatsAppService,
  ) {}

  async redirectToAttendant(number: string, sector: string, message: string) {
    try {
      const requestData = { number, sector, message };

      // Log para depuração
      this.logger.log(`Encaminhando solicitação para atendimento:`, requestData);

      // Notifica o cliente
      await this.notifyClient(number, sector, message);

      // Salva a mensagem no histórico
      await this.saveChatHistory(number, sector, message);

      // Retorna os dados para que o controller faça a requisição HTTP
      return requestData;
    } catch (error) {
      this.logger.error(`Erro ao redirecionar para atendente: ${error.message}`);
      throw error;
    }
  }

  public async notifyClient(number: string, sector: string, message: string) {
    try {
      const formattedNumber = this.formatNumber(number);

      // Envia a mensagem para o cliente
      await this.whatsAppService.sendAutomaticMessage(
        formattedNumber,
        `Aguarde, assim que possível um atendente do ${sector} entrará em contato sobre sua solicitação:\n\n${message}`,
      );

      this.logger.log(`Notificação enviada para o cliente: ${formattedNumber}`);
      return { status: 'Mensagem enviada com sucesso!' };
    } catch (error) {
      this.logger.error(`Erro ao notificar cliente: ${error.message}`);
      throw error;
    }
  }

  // Método para formatar o número no padrão internacional
  private formatNumber(number: string): string {
    // Remove caracteres não numéricos
    const cleanedNumber = number.replace(/\D/g, '');

    // Verifica se o número já contém o código do país
    if (!cleanedNumber.startsWith('55')) {
      throw new Error('Número inválido. O número deve incluir o código do país (ex: 55 para Brasil).');
    }

    // Adiciona o sufixo @c.us
    return `${cleanedNumber}@c.us`;
  }

  public async saveChatHistory(number: string, sector: string, message: string) {
    try {
      await this.prismaClient.historyChat.create({
        data: {
          numero: number,
          setor: sector,
          mensagem: message,
        },
      });
      this.logger.log(`Mensagem registrada no histórico com sucesso.`);
    } catch (error) {
      this.logger.error(`Erro ao registrar a mensagem no histórico: ${error.message}`);
      throw error;
    }
  }
}