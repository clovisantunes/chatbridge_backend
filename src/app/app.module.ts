import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'src/modules/users/users.module';
import { WhatsappModule } from 'src/modules/whatsapp/whatsapp.module';

@Module({
  imports: [UsersModule, WhatsappModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
