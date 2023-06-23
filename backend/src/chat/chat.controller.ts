import { Body, Controller, Get, Post, Res, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {  channeDto,getConvDto} from './Dto/chat.dto';
import { ChatService } from './chat.service';
import { findUserDto } from 'src/user/dto/user.dto';
import { Response } from 'express';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService:ChatService){}

    // get conversation between two users
    @UseGuards(AuthGuard('jwt'))
    @Post('findConversation')
    async getConversation(@Body() getConv:getConvDto, @Res() response:Response){
        try{
            const result = await this.chatService.getConversation(getConv);
            response.status(200).json(result);
        }
        catch(error){
            response.status(400).json(error);
        }
    }

    // get conversations that user belongs to
    @UseGuards(AuthGuard('jwt'))
    @Post('conversations')
    async getConversationsOfUser(@Body() dto:findUserDto, @Res() response:Response){
        try{
            const result = await this.chatService.getConversationsOfUser(dto);
            response.status(200).json(result);
        }
        catch(error){
            response.status(400).json(error);
        }
    }

// channel

    // get conversation  channel 
    @UseGuards(AuthGuard('jwt'))
    @Post('channel/message/all')
    async getConversationChannel(@Body() chDto:channeDto, @Res() response:Response){
        try{
            const result = await this.chatService.getConversationChannel(chDto);
            response.status(200).json(result);
        }
        catch(error){
            response.status(400).json(error);
        }
    }

    // get all public channels
    @UseGuards(AuthGuard('jwt'))
    @Post('channel/all')
    async getAllChannels(){
        return await this.chatService.getAllChannels();
    }
    
    // get channel of user;
    @UseGuards(AuthGuard('jwt'))
    @Post('memberships')
    async getUserChannels(@Body() userDto:findUserDto, @Res() response:Response){
        try{
            const result = await this.chatService.getUserChannels(userDto);
            response.status(200).json(result);
        }
        catch(error){
            response.status(400).json(error);
        }
    }


    @UseGuards(AuthGuard('jwt'))
    @Post('channel/members')
    async getMembersOfChannel(@Body() chDto:channeDto, @Res() response:Response){
        try{
            const result = await this.chatService.getMembersOfChannel(chDto);
            response.status(200).json(result);
        }
        catch(error){
            response.status(400).json(error);
        }
    }

    // get members  of a channel
    @UseGuards(AuthGuard('jwt'))
    @Post('channel/memberShips')
    async getMembersOfChannelII(@Body() chDto:channeDto, @Res() response:Response){
        try{
            const result = await this.chatService.getMembersOfChannelII(chDto);
            response.status(200).json(result);
        }
        catch(error){
            response.status(400).json(error);
        }
    }
}
