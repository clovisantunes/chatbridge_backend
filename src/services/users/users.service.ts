import {  Injectable, NotFoundException } from "@nestjs/common";
import { User } from "src/app/interfaces/user.interface";
import prismaClient from "src/Prisma";




@Injectable()
export class UserService{
    async findOne(id: number): Promise<User>{
        const user = await prismaClient.user.findUnique({
            where: {
                id: id
            }
        });
        if (!user){
            throw new NotFoundException (`User id ${id} not found`);
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            admin: user.admin,
            phoneNumber: user.phoneNumber,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            lastLogin: user.lastLogin,
            messagesTecnico: user.messagesTecnico
        };
        
    }
}
