import { Injectable } from "@nestjs/common";
import { User } from "src/app/interfaces/user.interface";
import prismaClient from "src/Prisma";
import * as bcrypt from "bcrypt";

@Injectable()
class CreateUserService{
    async execute(user: User){
        const exists = await prismaClient.user.findUnique({
            where: {
                email: user.email
            }
        });
        if(exists){
            throw new Error('User already exists');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);

        const createUser = await prismaClient.user.create({
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                password: hashedPassword,
                admin: user.admin,
                isActive: user.isActive,
                phoneNumber: user.phoneNumber,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                lastLogin: user.lastLogin
                
            },
            select:{
                id: true,
                name: true,
                email: true,
                password: true,
                admin: true,
                phoneNumber: true,
                createdAt: true,
                updatedAt: true,
                lastLogin: true
            }
        })
        return createUser;
    }
}

export {CreateUserService};