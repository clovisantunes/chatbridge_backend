import { Injectable } from "@nestjs/common";
import prismaClient from "src/Prisma";



@Injectable()
export class DeleteSectorMessageService {
    async execute(id: number, userSector: string): Promise<any> {
        const messageFromSector = await prismaClient.historyChat.findUnique
    }
}