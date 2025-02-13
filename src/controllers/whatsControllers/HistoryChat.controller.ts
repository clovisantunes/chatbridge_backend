import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { HistoryChatService } from 'src/services/WhatsServices/HistoryChat.service';

@Controller('messages')
export class HistoryChatController {
  constructor(private readonly historyChatService: HistoryChatService) {}

  @Get('history')
  async getHistoryChat(@Headers('Authorization') authHeader: string) {
    // Validação do token
    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido.');
    }

    const token = authHeader.replace('Bearer ', '');

    // Aqui você pode adicionar a lógica para validar o token, se necessário

    // Retorna todas as mensagens do histórico
    return this.historyChatService.getAllChatHistory();
  }
}