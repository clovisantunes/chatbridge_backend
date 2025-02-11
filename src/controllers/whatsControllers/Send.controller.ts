import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { WhatsAppService } from 'src/services/WhatsServices/Send.service';
import { JwtAuthGuard } from 'src/config/JwtAuthGuard';

@Controller('whatsapp')
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  @UseGuards(JwtAuthGuard) 
  @Post('send')
  async sendMessage(
    @Request() req, 
    @Body() body: { to: string; message: string }
  ) {
    const userId = req.user.id;
    return await this.whatsappService.sendMessage(userId, body.to, body.message);
  }
}
