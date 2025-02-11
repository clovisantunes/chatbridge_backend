import {
    Body,
    Controller,
    Delete,
    UseGuards,
    Request,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtAuthGuard } from 'src/config/JwtAuthGuard';
  import { DeleteUserService } from 'src/services/users/DeleteUser.service';
  import { AdminGuard } from 'src/config/RoleGuards'; // Importando o guard
  
  @Controller('/users')
  export class DeleteUser {
    constructor(private readonly deleteUserService: DeleteUserService) {}
  
    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete('delete')
    async delete(
      @Body() body: { id: number }, // Recebe o ID do usuário a ser deletado
      @Request() request: any, // Acessa o request para pegar o ID do token
    ): Promise<{ message: string; data: any }> {
      try {
        // O JwtAuthGuard já valida o token e adiciona o usuário ao request
        const userIdFromToken = request.user.id; // ID do usuário contido no token
  
        // Chama o serviço para deletar o usuário
        const deletedUser = await this.deleteUserService.execute(
          body.id,
          userIdFromToken,
        );
  
        return {
          message: 'User deleted successfully',
          data: deletedUser,
        };
      } catch (error) {
        return {
          message: error.message || 'An error occurred while deleting the user',
          data: null,
        };
      }
    }
  }