import {  Injectable, NotFoundException } from "@nestjs/common";
import { User } from "src/app/interfaces/user.interface";
import { jwtConstants } from "src/config/token";
import prismaClient from "src/Prisma";
import * as jwt from 'jsonwebtoken';
import { get } from "http";



@Injectable()
export class GetAllUserService{

    private validateToken(token: string): number {
        try {
            const decoded: any = jwt.verify(token, jwtConstants.secret);
            if (!decoded.id) {
                throw new Error('Invalid token payload');
            }
            return decoded.id;
        }
        catch (error) {
            console.error('Token verification failed:', error.message);
            throw new Error('Invalid or expired token');
        }
    }
    async findUserById(token: string): Promise<User[]> {
        if(!token){
            throw new Error('Token not provided');
        }
        const userId = this.validateToken(token);
        const getUser = await prismaClient.user.findUnique({
            where: {id: userId},
        });
        if (!getUser || Number(getUser.id) !== userId) {
            throw new NotFoundException(`User with id ${userId} not found`);
        }
        if (getUser.admin === false) {
            throw new Error('Unauthorized');
        }
        if (getUser.admin === true) {
            const allUsers = await prismaClient.user.findMany();
            return allUsers;
        }
        else {
            throw new Error('Unauthorized');
        }
    }
}

