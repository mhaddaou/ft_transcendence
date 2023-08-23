import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import { PrismaService } from 'prisma/prisma.service';
import { Achievements } from './user/achievement.service';

@Module({
  imports: [AuthModule, UserModule, ChatModule,],
  controllers: [AppController],
  providers: [AppService, JwtService, UserService, PrismaService, Achievements],
})

export class AppModule {
}
