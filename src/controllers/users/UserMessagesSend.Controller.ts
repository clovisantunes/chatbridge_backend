import { Body, Controller, Get, Param } from "@nestjs/common";
import { UsersMessagesSendService } from "src/services/users/UsersMessagesSend.service";


@Controller('users')
export class UserMessagesSendController {
    constructor(private readonly usersMessagesSendService: UsersMessagesSendService) {}

    @Get('sendMessages')
    async findMessage(@Body('id') id: string) {
        return this.usersMessagesSendService.findMessages(parseInt(id));
    }
}