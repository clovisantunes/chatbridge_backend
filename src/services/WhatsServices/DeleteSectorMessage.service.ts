import { Injectable } from "@nestjs/common";
import prismaClient from "src/Prisma";

@Injectable()
export class DeleteSectorMessageService {
    async execute(messageId: number, sessionId: number, userIdFromToken: string): Promise<any> {
        const messageFromSector = await prismaClient.historyChat.findUnique({
            where: { id: messageId }
        });

        const userSession = await prismaClient.userSession.findFirst({
            where: { id: sessionId }
        });

        if (!userIdFromToken || !messageFromSector || !userSession) {
            throw new Error("Usuário não autenticado, mensagem ou sessão não encontrada.");
        }

        const deleteMessage = await prismaClient.historyChat.delete({
            where: { id: messageId }
        });

        const deleteSession = await prismaClient.userSession.delete({
            where: { id: sessionId }
        });

        return { deleteMessage, deleteSession };
    }
}
