import { Body, Controller, Delete, Request, UseGuards, HttpException, HttpStatus } from "@nestjs/common";
import { JwtAuthGuard } from "src/config/JwtAuthGuard";
import { AdminGuard } from "src/config/RoleGuards";
import { DeleteSectorMessageService } from "src/services/WhatsServices/DeleteSectorMessage.service";

@Controller('/sector')
export class DeleteSectorMessageController {
    constructor(private readonly deleteSectorMessageService: DeleteSectorMessageService) {}

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete('delete')
    async delete(
        @Body() body: { messageId: number, sessionId: number },
        @Request() request: any,
    ): Promise<{ message: string; data: any }> {
        if (!body.messageId || !body.sessionId) {
            throw new HttpException('Os IDs da mensagem e da sessão são obrigatórios.', HttpStatus.BAD_REQUEST);
        }

        try {
            const userIdFromToken = request.user.id;
            const deletedData = await this.deleteSectorMessageService.execute(
                body.messageId,
                body.sessionId,
                userIdFromToken
            );

            if (!deletedData) {
                throw new HttpException('Mensagem ou sessão não encontrada.', HttpStatus.NOT_FOUND);
            }

            return {
                message: 'Mensagem e sessão deletadas com sucesso',
                data: deletedData,
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Erro ao deletar a mensagem e sessão.',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
