import { Injectable } from "@nestjs/common";
import prismaClient from "src/Prisma";

@Injectable()
export class UsersMessagesSendService {
    async findMessages(userId: number) {
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
            include: {
                messagesTecnico: true, 
            },
        });

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        return user.messagesTecnico; 
    }
}
