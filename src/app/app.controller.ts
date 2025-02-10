import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('home')
export class AppController {
  @Get('hello')
  getHello(): string {
    return 'hello';
  }
}
