import { Body, Controller, Post } from "@nestjs/common";
import { AuthUserService } from "src/services/users/AuthUser.service";

@Controller('auth')
export class AuthUserController {
    constructor(private readonly authUserService: AuthUserService) {}

    @Post('')
    async login(@Body('email') email: string, @Body('password') password: string) {
        return await this.authUserService.execute(email, password);
    }
}