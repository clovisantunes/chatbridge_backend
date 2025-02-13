import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import * as fs from 'fs';
import * as path from 'path';
import prismaClient from 'src/Prisma';
import { WhatsAppGateway } from 'src/config/Whatsapp.gateway';
import { UserSessionService } from './UserSession.service';
import { SectorService } from './Sector.service';

@Injectable()
export class WhatsAppService {
  public client: Client;
  private readonly logger = new Logger(WhatsAppService.name);
  private sessionDataPath = path.join(__dirname, '..', '.wwebjs_auth');
  private isReconnecting = false;

  constructor(
    @Inject(forwardRef(() => SectorService))
    private readonly whatsAppGateway: WhatsAppGateway,
    private readonly sectorService: SectorService,
    public readonly userSessionService: UserSessionService
  ) {
    this.initializeClient();
  }

  private initializeClient() {
    const sessionExists = fs.existsSync(this.sessionDataPath);

    this.client = new Client({
      authStrategy: new LocalAuth({
        dataPath: this.sessionDataPath, 
        clientId: 'default', 
      }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    this.client.on('qr', (qr) => {
      if (!sessionExists) {
        this.logger.log('Escaneie este QR Code para conectar ao WhatsApp:');
        qrcode.generate(qr, { small: true });
      }
    });

    this.client.on('ready', () => {
      this.logger.log('✅ Conectado ao WhatsApp Web!');
    });

    this.client.on('disconnected', (reason) => {
      this.logger.error(`❌ Desconectado do WhatsApp Web. Motivo: ${reason}`);
      this.handleDisconnection(reason === 'LOGOUT');
    });

    this.client.on('auth_failure', (msg) => {
      this.logger.error(`❌ Falha na autenticação: ${msg}`);
      this.handleDisconnection(false);
    });

    this.client.on('message', async (message) => {
      try {
        await this.handleIncomingMessage(message);
      } catch (error) {
        this.logger.error(`Erro ao processar mensagem: ${error.message}`);
      }
    });

    this.client.initialize().catch((error) => {
      this.logger.error(`Erro ao inicializar o cliente: ${error.message}`);
      this.handleDisconnection(false);
    });
  }

  private async handleDisconnection(isManualLogout: boolean) {
    if (this.isReconnecting) {
      this.logger.log('Reconexão já em andamento. Ignorando nova tentativa.');
      return;
    }

    this.isReconnecting = true;
    this.logger.log('Iniciando processo de reconexão...');

    if (isManualLogout) {
      this.logger.log('Logout manual detectado. Reinicializando o cliente...');
      this.initializeClient();
      this.isReconnecting = false;
      return;
    }

    setTimeout(async () => {
      this.logger.log('Tentando reconectar...');
      this.initializeClient();
      this.isReconnecting = false;
    }, 10000); 
  }

  public async sendAutomaticMessage(to: string, message: string) {
    await this.client.sendMessage(to, message);
  }

  async waitForUserResponse(from: string): Promise<string> {
    return new Promise((resolve) => {
        const messageListener = async (message: any) => {
            if (message.from === from) {
                this.client.off('message', messageListener); // Remove o listener após capturar a resposta
                resolve(message.body.trim()); // Retorna a resposta do usuário
            }
        };

        this.client.on('message', messageListener);
    });
}

  public async handleIncomingMessage(message: any) {
    const from = message.from; // Número do usuário
    const messageContent = message.body.trim(); // Conteúdo da mensagem

    // Obtém o setor atual do usuário
    let userSector = await this.userSessionService.getUserSector(from);

    // Se o usuário não tem um setor, oferecer opções apenas uma vez
    if (!userSector || userSector === "nenhum") {
        if (messageContent !== "1" && messageContent !== "2") {
            await this.sendAutomaticMessage(
                from,
                `Bem-vindo! Selecione o que deseja:\n\n1️⃣ - Suporte Técnico\n2️⃣ - Financeiro`
            );
            return; // Finaliza a execução aqui
        }
       

        // Se o usuário escolheu um setor, salvar e seguir
        const selectedSector = messageContent === "1" ? "Suporte Técnico" : "Financeiro";
        await this.userSessionService.setUserSector(from, selectedSector);
        await this.sendAutomaticMessage(
            from,
            `Você escolheu o setor ${selectedSector}. O que deseja fazer?\n\n1️⃣ - Descrever solicitação\n2️⃣ - Voltar`
        );
        return; // Finaliza a execução aqui
    }

    // Se o usuário já tem um setor e ainda não respondeu se quer continuar
// Defina uma variável para controlar se a solicitação de descrição já foi feita
let descricaoSolicitada = false;

// Verifique se o usuário já tem um setor e não respondeu se quer continuar
if (messageContent !== "1" && messageContent !== "2" && descricaoSolicitada) {
    await this.sendAutomaticMessage(
        from,
        `O que deseja fazer?\n\n1️⃣ - Descrever solicitação\n2️⃣ - Voltar`
    );
    descricaoSolicitada = false
    return;
}
 
// Se o usuário escolheu "Descrever solicitação" e ainda não solicitou a descrição
if (messageContent === "1") {
    await this.sendAutomaticMessage(
        from,
        `Por favor, descreva sua solicitação.`
    );

    // Marca o usuário como "aguardando descrição"
    await this.userSessionService.setUserSector(from, `${userSector}_aguardando_descricao`);

    // Aguarda a resposta do usuário
    const descriptionContent = await this.waitForUserResponse(from);

    // Verifica se a descrição foi fornecida
    if (descriptionContent && descriptionContent.trim() !== '') {
        await this.sectorService.redirectToAttendant(from, userSector, descriptionContent);
        // Reseta o setor para o valor original (sem "_aguardando_descricao")
        await this.userSessionService.setUserSector(from, userSector);
    }
    descricaoSolicitada = true;

    // Marque que a descrição foi solicitada para evitar o loop
}

    // Se o usuário escolheu "Voltar"
    if (messageContent === "2") {
        await this.userSessionService.setUserSector(from, "nenhum");
        await this.sendAutomaticMessage(
            from,
            `Atendimento reiniciado. Selecione o que deseja:\n\n1️⃣ - Suporte Técnico\n2️⃣ - Financeiro`
        );
        return; 
    }

  
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
        data: receivedMessage,
      });

      await this.automaticResponse(message); // Resposta automática
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

      const user = await prismaClient.user.findUnique({ where: { id: userId } });

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
        },
      });

      this.whatsAppGateway.emitNewMessage({
        number: to,
        name: user.name,
        message: formattedMessage,
        timeStamp: new Date(),
      });

      this.logger.log(`Mensagem enviada: ${formattedMessage}`);
      return { status: 'Mensagem enviada com sucesso!' };
    } catch (error) {
      this.logger.error(`Erro ao enviar mensagem: ${error.message}`);
      throw error;
    }
  }

  public async automaticResponse(message: any) {
    try {
      const from = message.from;
      const messageContent = message.body.trim();
  
      // Obtém o setor atual do usuário
      const userSession = await this.userSessionService.getUserSector(from);
  
      // Encaminha a mensagem para o SectorService processar
    } catch (error) {
      this.logger.error(`Erro ao processar resposta automática: ${error.message}`);
    }
  }
}