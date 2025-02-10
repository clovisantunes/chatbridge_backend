import {  Injectable, NotFoundException } from "@nestjs/common";
import { User } from "src/app/interfaces/user.interface";
import prismaClient from "src/Prisma";




@Injectable()
export class GetAllUserService{
    async findAll(): Promise<User[]>{
        return prismaClient.user.findMany();
    }
  
}

