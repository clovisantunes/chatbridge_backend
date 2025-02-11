import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import prismaClient from "src/Prisma"; 
import * as bcrypt from "bcrypt";
import { jwtConstants } from "src/config/token";

@Injectable()
class AuthUserService {
    constructor(private jwtService: JwtService) {}

    async execute(email: string, password: string): Promise<{ message: string; token: string }> {
        const authUser = await prismaClient.user.findUnique({
            where: { email }
        });

        if (!authUser) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, authUser.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const token = this.jwtService.sign(
            { id: authUser.id, email: authUser.email , admin: authUser.admin },
            { expiresIn: jwtConstants.expiresIn } 
        );

        return { message: "Login successful", token };
    }
}

export { AuthUserService };