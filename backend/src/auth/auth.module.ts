import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwtStrategy/jwt.strategy';
import { QuaranteDeuxStrategy } from './oauth42/oauth42.strategy';
import { ftAuthGuard } from './oauth42/oauth.guard';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'prisma/prisma.service';
import { Achievements } from 'src/user/achievement.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({secret: `${process.env.jwt_secret}`,signOptions: { expiresIn: '1d' }}),
    UserModule,

  ],
  providers: [AuthService, JwtStrategy,QuaranteDeuxStrategy,ftAuthGuard, UserService, Achievements, PrismaService ],
  controllers: [AuthController]
})
export class AuthModule {}
