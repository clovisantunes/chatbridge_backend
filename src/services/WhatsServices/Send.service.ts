import { Injectable, Logger } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import * as fs from 'fs';
import * as path from 'path';
import prismaClient from 'src/Prisma';
import { WhatsAppGateway } from 'src/config/Whatsapp.gateway';

@Injectable()
export class WhatsAppService {
  public client: Client;
  private readonly logger = new Logger(WhatsAppService.name);
  private sessionDataPath = path.join(__dirname, '..', '.wwebjs_auth'); // Path to session data

  constructor(private readonly whatsAppGateway: WhatsAppGateway) {
    this.initializeClient();
  }

  private initializeClient() {
    this.client = new Client({
      authStrategy: new LocalAuth({
        dataPath: this.sessionDataPath, // Specify the session data path
      }),
    });

    this.client.on('qr', (qr) => {
      this.logger.log('Escaneie este QR Code para conectar ao WhatsApp:');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      this.logger.log('✅ Conectado ao WhatsApp Web!');
    });

    this.client.on('disconnected', (reason) => {
      this.logger.error(`❌ Desconectado do WhatsApp Web. Motivo: ${reason}`);
      this.clearSessionAndReinitialize();
    });

    this.client.on('auth_failure', (msg) => {
      this.logger.error(`❌ Falha na autenticação: ${msg}`);
      this.clearSessionAndReinitialize();
    });

    this.client.on('message', async (message) => {
      try {
        await this.getAllMessages(message);
      } catch (error) {
        this.logger.error(`Erro ao processar mensagem: ${error.message}`);
      }
    });

    this.client.initialize().catch((error) => {
      this.logger.error(`Erro ao inicializar o cliente: ${error.message}`);
      this.clearSessionAndReinitialize();
    });
  }

  private clearSessionAndReinitialize() {
    this.logger.log('Limpando cache da sessão e reinicializando o cliente...');

    // Delete the session data directory
    if (fs.existsSync(this.sessionDataPath)) {
      fs.rmdirSync(this.sessionDataPath, { recursive: true });
      this.logger.log('Cache da sessão removido com sucesso.');
    } else {
      this.logger.log('Nenhum cache de sessão encontrado.');
    }

    // Reinitialize the client
    this.initializeClient();
  }

  async getAllMessages(message: any) {
    try {
      const contact = await message.getContact();
      const nome = contact.name || contact.pushname || contact.number;

      const receivedMessage = {
        number: message.from,
        name: nome,
        message: message.body,
        timeStamp: new Date(message.timestamp * 1000),
      };

      await prismaClient.messageWhats.create({
        data: {
          number: receivedMessage.number,
          name: receivedMessage.name,
          message: receivedMessage.message,
          timeStamp: receivedMessage.timeStamp,
        },
      });

      this.whatsAppGateway.emitNewMessage(receivedMessage);
      this.logger.log(`Mensagem recebida: ${JSON.stringify(receivedMessage)}`);
    } catch (error) {
      this.logger.error(`Erro ao salvar mensagem: ${error.message}`);
    }
  }

  async sendMessage(userId: number, to: string, message: string) {
    try {
      if (!to.includes('@c.us')) {
        to = to + '@c.us';
      }

      const user = await prismaClient.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const formattedMessage = `Atendente: ${user.name}\n${message}`;

      await this.client.sendMessage(to, formattedMessage);

      const sentMessage = await prismaClient.messageTecnico.create({
        data: {
          content: formattedMessage,
          recipient: to,
          userId: user.id,
        },
      });

      this.whatsAppGateway.emitNewMessage({
        number: to,
        name: user.name,
        message: formattedMessage,
        timeStamp: new Date(),
      });

      this.logger.log(`Mensagem enviada: ${JSON.stringify(sentMessage)}`);
      return { status: 'Mensagem enviada com sucesso!' };
    } catch (error) {
      this.logger.error(`Erro ao enviar mensagem: ${error.message}`);
      throw error;
    }
  }
}