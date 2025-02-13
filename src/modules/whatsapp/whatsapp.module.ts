import { Module, forwardRef } from '@nestjs/common';
import { JwtAuthGuard } from 'src/config/JwtAuthGuard';
import { WhatsAppController } from 'src/controllers/whatsControllers/Send.controller';
import { WhatsAppService } from 'src/services/WhatsServices/Send.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/config/token';
import { ReceiveController } from 'src/controllers/whatsControllers/ReceiveMessage.controller';
import { DeleteUser } from 'src/controllers/users/DeleteUser.controller';
import { DeleteUserService } from 'src/services/users/DeleteUser.service';
import { WhatsAppGateway } from 'src/config/Whatsapp.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { SectorService } from 'src/services/WhatsServices/Sector.service';
import { SectorController } from 'src/controllers/whatsControllers/sector.controller';
import { GetSectorMessagesService } from 'src/services/WhatsServices/GetSectorMessage.Service';
import { GetSectorMessagesController } from 'src/controllers/whatsControllers/GetSectorMessage.controller';
import { UserSessionService } from 'src/services/WhatsServices/UserSession.service';
import { UserSessionController } from 'src/controllers/whatsControllers/UserSession.controller';
import { HistoryChatController } from 'src/controllers/whatsControllers/HistoryChat.controller';
import { HistoryChatService } from 'src/services/WhatsServices/HistoryChat.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  providers: [
    WhatsAppService, // Usa WhatsAppService diretamente
    HistoryChatService,
    JwtAuthGuard,
    SectorService,
    PrismaService,
    DeleteUserService,
    GetSectorMessagesService,
    GetSectorMessagesService,
    UserSessionService,
    WhatsAppGateway,
    {
      provide: 'WEBSOCKET_SERVER',
      useFactory: (gateway: WhatsAppGateway) => gateway.server,
      inject: [WhatsAppGateway],
    },
  ],
  controllers: [
    WhatsAppController,
    ReceiveController,
    UserSessionController,
    SectorController,
    DeleteUser,
    GetSectorMessagesController,
    HistoryChatController
  ],
  exports: [
    forwardRef(() => WhatsAppService), // Exporta com forwardRef
    WhatsAppGateway,
    forwardRef(() => SectorService), // Exporta com forwardRef
    GetSectorMessagesService,
    UserSessionService,
    HistoryChatService
  ],
})
export class WhatsappModule {}