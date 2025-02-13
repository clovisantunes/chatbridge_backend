import { Controller, Post, Body, Logger } from '@nestjs/common';
import { SectorService } from 'src/services/WhatsServices/Sector.service';

@Controller('sector')
export class SectorController {
  private readonly logger = new Logger(SectorController.name);

  constructor(private readonly sectorService: SectorService) {}

  @Post('redirect')
  async redirectToAttendant(
    @Body('number') number: string,
    @Body('sector') sector: string,
    @Body('message') message: string,
  ) {
    try {
      this.logger.log(`Recebida solicitação para redirecionar atendimento:`, {
        number,
        sector,
        message,
      });

      // Chama o método do SectorService para processar a solicitação
      const result = await this.sectorService.redirectToAttendant(number, sector, message);

      // Retorna a resposta do SectorService
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error(`Erro ao redirecionar atendimento: ${error.message}`);
      return {
        success: false,
        message: `Erro ao redirecionar atendimento: ${error.message}`,
      };
    }
  }
}