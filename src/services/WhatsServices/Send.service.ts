import { Injectable } from '@nestjs/common';
import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import prismaClient from 'src/Prisma';

@Injectable()
export class WhatsAppService {
  public client: Client;

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
    });

    this.client.on('qr', (qr) => {
      console.log('Escaneie este QR Code para conectar ao WhatsApp:');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      console.log('✅ Conectado ao WhatsApp Web!');
    });

    this.client.initialize();
  }

  async sendMessage(userId: number, to: string, message: string) {
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

    await prismaClient.messageTecnico.create({
      data: {
        content: formattedMessage,
        recipient: to,
        userId: user.id,
      }
    })

    return { status: 'Mensagem enviada com sucesso!' };
  }

  async getAllMessages(): Promise<

  // Ajustar para salvar no database os dados do contato somente nome numero
    { numero: string; nome: string; mensagem: string; data: Date }[]
  > {
    const chats = await this.client.getChats(); 

    const messages = [];

    for (const chat of chats) {
      const chatMessages = await chat.fetchMessages({ limit: 100 });

      const contact = await chat.getContact();
      const nome = contact.name || contact.pushname || contact.number;

      for (const message of chatMessages) {
        messages.push({
          numero: message.from,
          nome: nome, 
          mensagem: message.body, 
          data: message.timestamp,
        });
      }
    }

    return messages;
  }
}