import { BadRequestException, Injectable, NotFoundException, Req } from '@nestjs/common';
import { LoginDto, TwoFADto, findUserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { toDataURL } from 'qrcode';
import { authenticator } from '@otplib/preset-default';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService:JwtService, 
        private readonly userService:UserService,
        private prisma:PrismaService){}

    async login42(req:any) {
            const  { login, displayname, email} = req.user._json;
            const userInfo = {login:login, username:displayname, email:email};
            const loginDto:LoginDto = userInfo;
            let user = await this.prisma.client.user.findFirst({where:{login:login}});
            if (!user)
            {
                user = await this.userService.createUser(loginDto);
            }
            const payload = { login:user.login, sub:user.UserId };
            return await this.jwtService.signAsync(payload);
    }

    // 2-FA Google Authenticator
    async generateNewQrCode(userDto:findUserDto){
        const user = await this.userService.findUser(userDto);
        if (!(user.enableTwoFa))
            throw new NotFoundException("user had not enable twoFA");
        const secret = await authenticator.generateSecret();
        await this.prisma.client.user.update({
            where:{
                UserId:user.UserId,
            },
            data:{
                twoFactorSecret:secret,
            }
        });
        const otpauthUrl = await authenticator.keyuri(user.email,'PigPonG', secret);  
        const qrImg = await toDataURL(otpauthUrl);
        return {qrImg};
    }

    async validateCode2FA(twoFA:TwoFADto){
        const {login, code} = twoFA;
        let user = await this.userService.findUser({login:login});
        const secret = user.twoFactorSecret;
        return await authenticator.verify({
            token: code,
            secret: secret,
          });
    }
    
}
