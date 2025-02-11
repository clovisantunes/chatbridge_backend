import { Injectable } from "@nestjs/common";
import prismaClient from "src/Prisma";

@Injectable()
export class UsersMessagesSendService {
    async findMessages(userId: number) {
        // Verifica se o usuário existe
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
            include: {
                messagesTecnico: true,  // Certifique-se de incluir as mensagens enviadas
            },
        });

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        return user.messagesTecnico;  // Retorna as mensagens enviadas
    }
}
