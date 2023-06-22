import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'prisma/prisma.service';
import { Achievements } from './achievement.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService,PrismaService, Achievements ]
})
export class UserModule {}
