import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/config/JwtAuthGuard';
import { jwtConstants } from 'src/config/token';
import { AuthUserController } from 'src/controllers/users/AuthUser.controller';
import { CreateUser } from 'src/controllers/users/CreateUser.controller';
import { DetailUserController } from 'src/controllers/users/DetailUser.controller';
import { UserMessagesSendController } from 'src/controllers/users/UserMessagesSend.Controller';
import { UsersController } from 'src/controllers/users/users.controller';
import { AuthUserService } from 'src/services/users/AuthUser.service';
import { CreateUserService } from 'src/services/users/CreateUser.service';
import { DetailUserService } from 'src/services/users/DetailUser.service';
import { GetAllUserService } from 'src/services/users/getAllUsers.service';
import { UserService } from 'src/services/users/users.service';
import { UsersMessagesSendService } from 'src/services/users/UsersMessagesSend.service';

@Module({
    providers: [UserService, CreateUserService, GetAllUserService,JwtAuthGuard, DetailUserService, AuthUserService, UsersMessagesSendService ],
    controllers: [UsersController, CreateUser, DetailUserController, AuthUserController, UserMessagesSendController],
    imports: [
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: jwtConstants.expiresIn }
        })
    ],


})
export class UsersModule {
}
