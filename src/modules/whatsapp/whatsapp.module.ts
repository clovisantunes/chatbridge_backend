import { Module } from '@nestjs/common';
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

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: jwtConstants.expiresIn }
        })
    ],
    providers: [WhatsAppService, JwtAuthGuard, DeleteUserService, WhatsAppGateway,
        {
          provide: 'WEBSOCKET_SERVER',
          useFactory: (gateway: WhatsAppGateway) => gateway.server,
          inject: [WhatsAppGateway],
        },],
    controllers: [WhatsAppController, ReceiveController, DeleteUser],
    exports: [WhatsAppService, WhatsAppGateway], 
})
export class WhatsappModule {}

