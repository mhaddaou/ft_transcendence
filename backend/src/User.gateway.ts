import { User, channel } from '.prisma/client';
import { JwtService } from '@nestjs/jwt';
import {ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets'
import { Socket, Server} from 'socket.io'
import { JwtStrategy } from 'src/auth/jwtStrategy/jwt.strategy';
import { UserService } from 'src/user/user.service';
import { ChannelDto, DeleteMemberChannelDto, MemberChannelDto, deleteChannelDto, leaveChannel, msgChannelDto, newChannelDto, newDeleteChannelDto, newDeleteMemberChannelDto, newLeaveChannel, newMemberChannelDto, newMsgChannelDto, newUpdateChannelDto, newUpdateMemberShipDto, sendMsgSocket, updateChannelDto, updateMemberShipDto } from './chat/Dto/chat.dto';
import { ChatService } from './chat/chat.service';
import { BadRequestException, NotFoundException, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WebsocketExceptionsFilter } from './chat/socketException';
import { FriendDto, UpdateStatus, UpdateUserDto, newBlockDto, newFriendDto, newUpdateUserDto } from 'src/user/dto/user.dto';
import { BlockDto } from 'src/user/dto/user.dto';
import { createHash } from 'crypto';
import { matterNode, measurements } from './Game/game.service';
import { PrismaService } from 'prisma/prisma.service';

@WebSocketGateway(3333, {cors:true})
@UseFilters(WebsocketExceptionsFilter)
@UsePipes(new ValidationPipe({ transform: true }))
export class UserGateWay implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit{
    constructor(private readonly jwtStrategy:JwtStrategy, private readonly userService:UserService,private readonly jwtService:JwtService, private readonly chatService:ChatService,  private  prisma:PrismaService ){    
        this.setExistenChannels();
    }
    // server
    @WebSocketServer()
    server:Server;

    // game
    private worlds = {};
    private world: matterNode
    afterInit() {
        this.worlds = {};
    }
    //
    blackListedJwt:Map<string, string> = new Map();
    connectedUsers:Map<string, User> = new Map();
    existChannels:Map<string, channel> = new Map();
    connectedSocket:Map<string, Socket> = new Map();
    // fetch all channels in database and set them in map
    async setExistenChannels(){
        const channels = await this.chatService.getAllChannels();
        channels.forEach((channel) => {this.existChannels.set(channel.channelName,channel)});
    }
    // handle connection user
    // Socket should contain a user's jwt to connect him succefully 
    async handleConnection(client: Socket) {
        try{
            const token = client.handshake.headers.authorization;
            const hashedToken:string = await createHash('sha256').update(token).digest('hex');
            if (this.blackListedJwt.has(hashedToken))
                throw new BadRequestException('this jwt token is black Listed you have re login');
            const decodedToken = await this.jwtService.verify(token,{secret:`${process.env.jwt_secret}`});
            const login = decodedToken.login;
            const user = await this.userService.findUser({login:login});
            const key =  this.findKeyByLogin(user.login);
            if (this.connectedSocket.has(key))
            {
                this.handleDisconnect(this.connectedSocket.get(key));
            }
            this.connectedSocket.set(client.id,client);
            this.connectedUsers.set(client.id,user);
            const roomsToJoin = await this.chatService.getUserNameChannels({login:user.login});
            roomsToJoin.forEach((channelName) => {
                client.join(channelName);
            });
            // set status online in database
            const dto:UpdateStatus = {login:user.login, isOnline:true, inGame:undefined};
            await this.userService.modifyStatusUser(dto);
            console.log(`${user.login} had connected   ${client.id}`);
            client.emit('message',`welcome ${this.connectedUsers.get(client.id).username} you have connected succefully`);
        }
        catch(error){
            this.connectedSocket.delete(client.id);
            this.connectedUsers.delete(client.id);
            client.emit('errorMessage', error);
            client.disconnect();
        }
    }

    // handle disconnection user
    async handleDisconnect(client: Socket) {
        try {
            const user = this.connectedUsers.get(client.id);
            if (!user)
                throw new NotFoundException(`cant find sender User`);
            // set status offline in database
            const dto:UpdateStatus = {login:user.login, isOnline:false, inGame:undefined};
            await this.userService.modifyStatusUser(dto);
            client.emit("message",'you have disonnected');
            console.log(`${user.login} had disconected  ${client.id}`);
            this.connectedUsers.delete(client.id);
            this.connectedSocket.delete(client.id);
            // game
            this.world?.handleDisconnect(client);
            if (!this.server.engine.clientsCount) {
                this.world.clearGame()
                console.log("deleting room")
                const roomId = this.world.roomId
                delete this.worlds[roomId]
                this.worlds[roomId] = null
            }
            //
        }
        catch(error){
            client.emit(error);
        }
    }


    // game
    // to store a match use :   this.userService.storeMatch(objet)  objet:
    // loginA:string;
    // loginB:string;
    // scoreA: number;
    // scoreB: number;
    // winner: boolean;
    @SubscribeMessage('joinRoom')
    handleJoinRoom(@MessageBody() data: { roomId: string, obj: measurements }, @ConnectedSocket() client: Socket) {
        try{
            const user = this.connectedUsers.get(client.id);
            if (!user)
                    throw new BadRequestException('no such user');
            const { roomId } = data;
            console.log("user joined room", roomId, "and page height is", !this.worlds[roomId] == false)
            if (!this.worlds[roomId]) {
                console.log("new room");
                this.world = new matterNode(this.server, roomId, data.obj);
                this.worlds[roomId] = this.world;
                this.world.sendBallPosition();
            }
            else
                this.world = this.worlds[roomId];
            client.join(roomId); // add the client to the specified room
            this.world.handleConnection(client);
        }
        catch(error){
            client.emit("errorMessage", error);
        }
    }

// channel
    findKeyByLogin(login: string): string | undefined {
        for (const [key, user] of this.connectedUsers) {
          if (user.login === login) {
            return key;
          }
        }
        return undefined;
      }

    // create new channel
    @SubscribeMessage('newChannel')
    async createNewChannel(@ConnectedSocket() client:Socket, @MessageBody() body:newChannelDto){
        try{
            const {channelName,isPrivate , ispassword, password} = body;
            if (this.existChannels.has(body.channelName))
                throw new BadRequestException('Channel already exists');
            const user = this.connectedUsers.get(client.id);
            if (!user)
                throw new NotFoundException('no such user');
            const dto:ChannelDto = {channelName:channelName,isPrivate:isPrivate, LoginOwner:user.login,ispassword:ispassword,password:password};
            const channel = await this.chatService.createNewChannel(dto);
            this.existChannels.set(channel.channelName,channel);
            client.join(channel.channelName);
            client.emit('message',`your Channel: ${channel.channelName} has been created`);
        }
        catch(error){
            client.emit("errorMessage", error);
        }
    }

    // update channel  : turne it public or private , change Owner , or password
    @SubscribeMessage('updateChannel')
    async updateChannel(@ConnectedSocket() client:Socket, @MessageBody() body:newUpdateChannelDto){
        try{
            if (!this.existChannels.has(body.channelName))
                throw new BadRequestException('no such Channel');
            const user = this.connectedUsers.get(client.id)
            if (!user)
                throw new NotFoundException('no such user');
            const dto:updateChannelDto = {userLogin:user.login, channelName:body.channelName, isPrivate:body.isPrivate, ispassword:body.ispassword, newPassword:body.newPassword};
            const channel = await this.chatService.updateChannel(dto);
            this.existChannels.set(channel.channelName,channel);
            client.emit('message','changes have been sauvegardeded');
        }
        catch(error){
            client.emit('errorMessage',error);
        }
    }

    // delete channel
    @SubscribeMessage('deleteChannel')
    async deleteChannel(@ConnectedSocket() client:Socket, @MessageBody() body:newDeleteChannelDto){
        try{
            if (!this.existChannels.has(body.channelName))
                throw new BadRequestException('no such Channel');
            const user = this.connectedUsers.get(client.id)
            if (!user)
                throw new NotFoundException('no such user');
            const dto:deleteChannelDto = {channelName:body.channelName, LoginOwner:user.login }
            await this.chatService.deleteChannel(dto);
            this.existChannels.delete(body.channelName);
            client.emit('message',`you have been delete ${body.channelName} channel`);
        }
        catch(error){
            client.emit('errorMessage',error);
        }
    }

    // add new Member to a channel
    @SubscribeMessage('joinChannel')
    async joinChannel(@ConnectedSocket() client:Socket, @MessageBody() body:newMemberChannelDto){
        try{
            if (!this.existChannels.has(body.channelName))
                throw new BadRequestException('no such Channel');
            const user = this.connectedUsers.get(client.id);
            if (!user)
                throw new NotFoundException('no such user');
            // add client as member to  database
            const dto:MemberChannelDto = {channelName:body.channelName,login:user.login,password:body.password};
            const memberShip = await this.chatService.createMemberChannel(dto);
            const channel = await this.chatService.findChannel({channelName:body.channelName});
            this.existChannels.set(channel.channelName,channel);
            client.join(channel.channelName);
            client.emit('message',`you have been Joined to ${channel.channelName} channel`);
        }
        catch(error){
            client.emit('errorMessage', error);
        }
    }

    // delete member from a channel
    @SubscribeMessage('kickMember')
    async kickMemberFromChannel(@ConnectedSocket() client:Socket, @MessageBody() body:newDeleteMemberChannelDto){
        try{
                if (!this.existChannels.has(body.channelName))
                    throw new BadRequestException('no such Channel');
                const user = this.connectedUsers.get(client.id)
                if (!user)
                    throw new NotFoundException('no such user');
                const dto:DeleteMemberChannelDto = {channelName:body.channelName, login:user.login, loginDeleted:body.loginDeleted};
                await this.chatService.deleteMemberShip(dto);
                const socketId = this.findKeyByLogin(body.loginDeleted);
                if (socketId)
                    this.server.in(socketId).socketsLeave(body.channelName);
                
                client.emit('message',`you have kicked ${body.loginDeleted} from ${body.channelName} channel`);
            }
            catch(error){
                client.emit('errorMessage', error);
            }
        }
    
    @SubscribeMessage('leaveChannel')
    async leaveChannel(@ConnectedSocket() client:Socket, @MessageBody() body:newLeaveChannel){
        try {
            const user = this.connectedUsers.get(client.id);
            if (!user)
                throw new BadRequestException('no such user');
            const dto:leaveChannel = {channelName:body.channelName,login:user.login};
            this.chatService.leaveChannel(dto);
            const channel = await this.chatService.findChannel({channelName:body.channelName});
            this.existChannels.set(channel.channelName,channel);
            client.leave(body.channelName);
            client.emit('message', `you have leaved ${dto.channelName}`)
        }
        catch(error){
            client.emit('errorMessage', error)
        }
    }

    // update a member ban mute ...
    @SubscribeMessage('updateMember')
    async updateUser(@ConnectedSocket() client:Socket, @MessageBody() body:newUpdateMemberShipDto){
        try {
            const channel = this.existChannels.get(body.channelName)
            if (!channel)
                throw new BadRequestException('no such channel');
            const user = this.connectedUsers.get(client.id)
            if (!user)
                throw new BadRequestException('no such user');
            const dto:updateMemberShipDto = {userLogin:user.login,channelName:body.channelName,loginMemberAffected:body.loginAffected, isMute:body.isMute, timeMute:body.timeMute, isBlacklist:body.isBlacklist, isAdmin:body.isAdmin}
            let memberShip = await this.chatService.updateMemberShip(dto);
            const actValues: string[] = Object.values(memberShip.acts);
            const separator: string = " , ";
            const msgAct: string = actValues.join(separator);
            this.server.in(channel.channelName).emit('message',`${user.login}  had  ${msgAct} ${memberShip.userAffectedMemberShip.login}`)
        }
        catch(error){
            client.emit('errorMessage',error);
        }   
    }

    // msg channel
    @SubscribeMessage('msgChannel')
    async newMsgChannel(@ConnectedSocket() client:Socket, @MessageBody() body:newMsgChannelDto){
        try{
            const {channelName, content}  = body
            const channel = this.existChannels.get(channelName)
            if (!channel)
                throw new BadRequestException('no such channel');
            const user = this.connectedUsers.get(client.id)
            if (!user)
                throw new NotFoundException('no such user');
            const dto:msgChannelDto = {login:user.login, content:content, channelName:channelName}
            const msg = await this.chatService.newMsgChannel(dto);
            if (msg)
            {
                this.server.to(msg.channelName).emit('message',{sender:user.login,content:msg.content});
            }
            else
                client.emit('errorMessage','cant send a msg to this channel');
        }
        catch(error){
            client.emit('errorMessage', error);
        }
    }

// user
    // update a user  you can update username , 2fa bool , avater
    @SubscribeMessage('updateUser')
    async updateUserEvent(@ConnectedSocket() client:Socket, @MessageBody() body:newUpdateUserDto){
        try{
            const user = this.connectedUsers.get(client.id)
            if (!user)
                throw new BadRequestException('no such user');
            const dto:UpdateUserDto = {login:user.login, username:body.username, bioGra:body.bioGra, avatar:body.avatar, enableTwoFa:body.enableTwoFa};
            if (dto.username !== undefined)
            {
                const userwithSameUsername = await this.userService.findUserwithSameUsername(dto.username);
                if (userwithSameUsername && userwithSameUsername.username === dto.username)
                    throw new BadRequestException(`we have already a user with username ${dto.username}!`);
            }
            const updatedUser = await this.userService.updateUser(dto);
            if (updatedUser)
            {
                this.connectedUsers.set(client.id,updatedUser);
                client.emit('message', updatedUser);
            }
            else
                client.emit('message', 'you had changed anything');
        }
        catch(error){
            client.emit('errorMessage', error);
        }
    }

    // handle private msg
    @SubscribeMessage('PrivateMessage')
    async handlePrivatemessage(@ConnectedSocket() client:Socket, @MessageBody() body:sendMsgSocket){
        try {
            const {receiver, content} = body;
            const userSender = this.connectedUsers.get(client.id);
            if (!userSender)
                throw new NotFoundException(`cant find sender User`);
            const userReceiver = await this.userService.findUser({login:receiver});
            if (userReceiver.login == userSender.login)
                throw new BadRequestException(`${receiver} cant send msg to ${receiver}`);
            // check if receiver had blocked client or opposite
            const IsEnemy = await this.userService.isBlockedMe({loginA:userSender.login,loginB:receiver});
            if (IsEnemy)
                throw new BadRequestException(`cant send any msg to ${receiver}`);
            const msg = await this.chatService.addNewMessage({sender:userSender.login,receiver:userReceiver.login, content:content});
            if (!msg)
                throw new BadRequestException(`cant send any msg to ${receiver}`);
            const receiverSocketId = this.findKeyByLogin(userReceiver.login);
            if (receiverSocketId)
            {
                this.server.to(receiverSocketId).emit('PrivateMessage', {sender:userSender.login ,receiver:userReceiver.login  ,content:content,sendAt:msg.sendAt});
            }
            // this.server.to(client.id).emit('PrivateMessage', {content:content,sendAt:msg.sendAt,fromUserA:msg.fromUserA});
        }
        catch(error){
            console.log(error);
            client.emit("errorMessage", error);
        }
    }
    content : string;
    sendAt: string;
    fromUserA: boolean;
    // event to blo9 someone or .remove block
    @SubscribeMessage('block')
    async blo9User(@ConnectedSocket() client:Socket, @MessageBody() body:newBlockDto){
        try{
            const user = this.connectedUsers.get(client.id);
            if (!user)
                throw new BadRequestException('no such user');
            const dto:BlockDto = {login:user.login, blockedLogin:body.blockedLogin}
            if (body.stillEnemy)
            {
                await this.userService.blockUser(dto);
                client.emit('message',` you have blocked ${body.blockedLogin}`);
            }
            else
            {
                await this.userService.removeBlock(user.login,body.blockedLogin);
                client.emit('message',` you have deblocked ${body.blockedLogin}`);
            }
        }
        catch(error){
            client.emit('errorMessage', error);
        }
    }

    // event to add friend or remove friend  bool : true: add new friend , false: remove friend
    @SubscribeMessage('friend')
    async friendUser(@ConnectedSocket() client:Socket, @MessageBody() body:newFriendDto){
        try {   
            const user = this.connectedUsers.get(client.id);
            if (!user)
                throw new BadRequestException('no such user');
            const dto:FriendDto = {loginA:user.login,loginB:body.login};
            if (body.bool)
            {
                await this.userService.createFriendship(dto);
                client.emit('message',` you have added ${user.username} friend`);
            }
            else
            {
                await this.userService.removeFriend(dto);
                client.emit('message',` you have removed ${user.username} friend`);
            }
        }
        catch(error){
            client.emit('errorMessage', error);
        }
    }

    // we need a token jwt of that  user to blacklist it
    @SubscribeMessage('logout')
    async lougOut(@ConnectedSocket() client:Socket){
        try {
            const user = this.connectedUsers.get(client.id);
            if (!user)
                throw new BadRequestException('no such user');
            // get token from header socket , hash it and set it in map  
            const token = client.handshake.headers.authorization;
            const hashedToken:string = await createHash('sha256').update(token).digest('hex');
            this.blackListedJwt.set(hashedToken,user.login);
            // set status offline in database
            const dto:UpdateStatus = {login:user.login, isOnline:false, inGame:undefined};
            await this.userService.modifyStatusUser(dto);
            client.emit('message',`${user.login} had log out`);
            this.connectedUsers.delete(client.id);
            this.connectedSocket.delete(client.id);
            client.disconnect();
        }
        catch(error){
            client.emit('errorMessage', error);
        }
    }
}