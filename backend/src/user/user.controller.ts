import { UserService } from 'src/user/user.service';
import { Body, Controller, Get,Req, Post, UseGuards, Res, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FriendDto ,findUserDto, storeMatchDto, usernameDto } from './dto/user.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
constructor(private readonly userSrevice:UserService){}

    // get all Users
    @UseGuards(AuthGuard('jwt'))
    @Get('all')
    async findAll(){
        return await this.userSrevice.findAllUsers();
    }
    
    // get a user by his token jwt and his friend
    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async findMe(@Req() req:any, @Res() response:Response){
        try{
            const { login} = req.user;
            const user = await this.userSrevice.findUser({login:login});
            const friends = await this.userSrevice.getUserFriends({login:login});
            const matches = await this.userSrevice.getHistoryUserMatchs({login:login});
            // get porcentages
            const porcentages = matches.pop();
            
            // get acheivement also ;
            const result = {...user, friends, porcentages, matches};
            response.status(200).json(result);
        }
        catch(error){
            response.status(400).json(error);
        }
    }

    // get user
    @UseGuards(AuthGuard('jwt'))
    @Post('find')
    async findOne(@Body() findUser:findUserDto, @Res() response:Response){
        try{
            const result = await this.userSrevice.findUser(findUser);
            response.status(200).json(result);
        }
        catch(e){
            response.status(400).json(e);
        }
    }

    // get user friends
    @UseGuards(AuthGuard('jwt'))
    @Post('friends')
    async getUserFriends(@Body() findUser:findUserDto, @Res() response:Response){
        try {
            const result =  await this.userSrevice.getUserFriends(findUser);
            response.status(200).json(result);
        }
        catch(error){
            response.status(400).json(error);
        }
    }

    // get list of blocked users
    @UseGuards(AuthGuard('jwt'))
    @Post('blocks')
    async getListBlocked(@Body() findUser:findUserDto, @Res() response:Response){
        try {
            const result =  await this.userSrevice.getBlockedList(findUser);
            response.status(200).json(result);
        }
        catch(error){
            response.status(400).json(error);
        }
    }

// get status of user
    @UseGuards(AuthGuard('jwt'))
    @Post('status')
    async getUserStatus(@Body() findUser:findUserDto, @Res() response:Response){
        try {
            const result =  await this.userSrevice.getStatusUser(findUser); 
            response.status(200).json(result);
        }
        catch(error){
            response.status(400).json(error);
        }
    }


// get stats of user
    @UseGuards(AuthGuard('jwt'))
    @Post('stats')
    async getUserStats(@Body() findUser:findUserDto, @Res() response:Response){
        try {
            const result = await this.userSrevice.getStatsUser(findUser); 
            response.status(200).json(result);
        }
        catch(error){
            response.status(400).json(error);
        }
    }

// matches
    @UseGuards(AuthGuard('jwt'))
    @Post('match')
    async storeNewMatch(@Body() matchDto:storeMatchDto){
        return await this.userSrevice.storeMatch(matchDto);
    }

    // get history of matches between of a  user
    @UseGuards(AuthGuard('jwt'))
    @Post('historyMatch')
    async getHistoryMatch(@Body() findUser:findUserDto, @Res() response:Response){
        try {
            const result = await this.userSrevice.getHistoryUserMatchs(findUser);
            response.status(200).json(result);
        }
        catch(error){
            response.status(400).json(error);
        }
    }
    
    // get history of matches between two users
    @UseGuards(AuthGuard('jwt'))
    @Post('historyFriend')
    async getHistoryOneVsOne(@Body() friendDto:FriendDto, @Res() response:Response){
        try {
            const result = await this.userSrevice.getHistoryOneVsOne(friendDto);
            response.status(200).json(result);
        }
        catch(error){
            response.status(400).json(error);
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('findLogin')
    async findUserWithUsername(@Body() dto:usernameDto, @Res() response:Response){
        try{
            const result =  await this.userSrevice.findUserWithUsername(dto);
            response.status(200).json(result);
        }
        catch(error){
            response.status(400 ).json(error);
        }
    }

    

}