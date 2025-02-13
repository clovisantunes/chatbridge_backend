import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserSessionService } from 'src/services/WhatsServices/UserSession.service'; 

@Controller('user-session')
export class UserSessionController {
  constructor(private readonly userSessionService: UserSessionService) {}

  @Post('set-sector')
  async setUserSector(@Body() body: { number: string; sector: string }) {
    return this.userSessionService.setUserSector(body.number, body.sector);
  }

  @Get('get-sector/:number')
  async getUserSector(@Param('number') number: string) {
    return this.userSessionService.getUserSector(number);
  }
}
