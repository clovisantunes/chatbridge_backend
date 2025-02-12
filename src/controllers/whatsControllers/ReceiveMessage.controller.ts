import { Controller, Get, UseGuards, Inject } from '@nestjs/common';
import { JwtAuthGuard } from 'src/config/JwtAuthGuard';
import { WhatsAppService } from 'src/services/WhatsServices/Send.service';
import { Server } from 'socket.io';

@Controller('whatsapp')
export class ReceiveController {
  constructor(
    private readonly whatsAppService: WhatsAppService,
    @Inject('WEBSOCKET_SERVER') private readonly io: Server 
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('messages')
  async getAllMessages() {
    const messages = await this.whatsAppService.getAllMessages({}); 

    this.io.emit('newMessages', messages);

    return { success: true, messages };
  }
}
