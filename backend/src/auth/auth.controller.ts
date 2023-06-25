import { Body, Controller, Get, InternalServerErrorException, Post, Req, Res, UseGuards } from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport'
import { AuthService } from './auth.service';
import { Response } from 'express';
import { TwoFADto, findUserDto } from 'src/user/dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

      @UseGuards(AuthGuard('42'))
      @Get('42')
      async login(@Req() req) {
      }

      @UseGuards(AuthGuard('42'))
      @Get('callback')
      async QuaranteDeuxCallback(@Req() req:any, @Res() response:Response) {
        try{
          let access = await this.authService.login42(req);
          console.log(access);
          response.redirect(`http://localhost:3000/GetData/${access}`);
        }
        catch(error){
          response.status(400).json(error);
        }
      }

    @UseGuards(AuthGuard('jwt'))
    @Post('QR')
    async generateNewQrCode(@Body() userDto:findUserDto, @Res() response:Response){
      try{
          const result = await this.authService.generateNewQrCode(userDto);
          response.status(200).json(result);
      }
      catch(error){
        response.status(400).json(error);
      }
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('2-FA')
    async validateAthenticaion(@Body() twoFA:TwoFADto, @Res() response:Response){
      try {
          const result = await this.authService.validateCode2FA(twoFA);
          response.status(200).json(result);
      }
      catch(error){
        response.status(400).json(error);
      }
    }
}