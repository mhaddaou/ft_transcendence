import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'prisma/prisma.service';
import { JwtStrategy } from 'src/auth/jwtStrategy/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { UserGateWay } from 'src/User.gateway';
import { Achievements } from 'src/user/achievement.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService,UserGateWay, UserService, PrismaService, JwtStrategy, JwtService, Achievements]
})
export class ChatModule {}
