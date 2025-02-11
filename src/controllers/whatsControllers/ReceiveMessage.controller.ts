import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/config/JwtAuthGuard';
import { WhatsAppService } from 'src/services/WhatsServices/Send.service';

@Controller('whatsapp')
export class ReceiveController {
  constructor(private readonly whatsAppService: WhatsAppService) {}
  @UseGuards(JwtAuthGuard)
  @Get('messages')
  async getAllMessages() {
    const messages = await this.whatsAppService.getAllMessages();
    return { success: true, messages };
  }
}