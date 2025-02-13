import { Controller, Get, Req, UnauthorizedException, Headers } from '@nestjs/common';
import { GetSectorMessagesService } from 'src/services/WhatsServices/GetSectorMessage.Service';

@Controller('messages')
export class GetSectorMessagesController {
  constructor(private readonly getSectorMessagesService: GetSectorMessagesService) {}

  @Get('sector')
  async getSectorMessages(@Headers('Authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido.');
    }

    const token = authHeader.replace('Bearer ', '');

    return this.getSectorMessagesService.getMessagesBySector(token);
  }
}
