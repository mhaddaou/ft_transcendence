import { User, channel } from '.prisma/client';
import { JwtService } from '@nestjs/jwt';
import {ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets'
import { Socket, Server} from 'socket.io'
import { JwtStrategy } from 'src/auth/jwtStrategy/jwt.strategy';
import { UserService } from 'src/user/user.service';
import { ChannelDto, DeleteMemberChannelDto, MemberChannelDto, deleteChannelDto, leaveChannel, msgChannelDto, newChannelDto, newDeleteChannelDto, newDeleteMemberChannelDto, newLeaveChannel, newMemberChannelDto, newMsgChannelDto, newUpdateChannelDto, newUpdateMemberShipDto, sendMsgSocket, updateChannelDto, updateMemberShipDto, gameInvite, cancelGame, InviteMemberChannelDto } from './chat/Dto/chat.dto';
import { ChatService } from './chat/chat.service';
import { BadRequestException, NotFoundException, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { WebsocketExceptionsFilter } from './chat/socketException';
import { FriendDto, UpdateStatus, UpdateUserDto, acceptFriend, findUserDto, invitationDto, newBlockDto, newFriendDto, newUpdateUserDto, storeMatchDto } from 'src/user/dto/user.dto';
import { BlockDto } from 'src/user/dto/user.dto';
import { createHash } from 'crypto';
import { checkQueue, matterNode, measurements, userInGame } from './Game/game.service';
import { PrismaService } from 'prisma/prisma.service';

@WebSocketGateway(3333, {cors:true})
@UseFilters(WebsocketExceptionsFilter)
@UsePipes(new ValidationPipe({ forbidNonWhitelisted: true, transform:true}))
export class UserGateWay implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit{
    constructor(private readonly userService:UserService,private readonly jwtService:JwtService, private readonly chatService:ChatService,  private  prisma:PrismaService ){    
        this.setExistenChannels();
    }
    // server
    @WebSocketServer()
    server:Server;

    // game
    private worlds = {};
    private world: matterNode;
    afterInit() {
        this.worlds = {};
    }
    //
    blackListedJwt:Map<string, string> = new Map();
    existChannels:Map<string, channel> = new Map();
    connectedSocket:Map<string, Socket> = new Map();
    connectedUsers:Map<string, User> = new Map();
    
    userSockets:Map<string, string[]> = new Map();
    // fetch all channels in database and set them in map
    async setExistenChannels(){
        const channels = await this.chatService.getAllChannels();
        channels.forEach((channel) => {this.existChannels.set(channel.channelName,channel)});
    }

    getLoginBySocketId(id:string){
        let ret = null;
        this.userSockets.forEach((values,key) => {
            if (values.includes(id))
                ret = key; 
        });
        return ret;
    }

    async MsgToUpdatedfriends(user:User){
        let socketsId:string[] = [];
        const allfriends = await this.userService.getUserFriends({login:user.login});
        const convLogins = await this.userService.getLoginsConversationOfUser(user.UserId);
        convLogins.forEach(login => {
            socketsId = this.userSockets.get(login);
            this.server.to(socketsId).emit('updatedFriend',user);
        });
        allfriends.friends.forEach(element => {
            if (!convLogins.includes(element.login)){
                socketsId = this.userSockets.get(element.login);
                this.server.to(socketsId).emit('updatedFriend',user);
        }});
        allfriends.pendingInvitation.forEach(element => {
            if (!convLogins.includes(element.login)){
                socketsId = this.userSockets.get(element.login);
                this.server.to(socketsId).emit('updatedFriend',user);
            }});
        allfriends.waitToAccept.forEach(element => {
            if (!convLogins.includes(element.login)){
                socketsId = this.userSockets.get(element.login);
                this.server.to(socketsId).emit('updatedFriend',user);
            }});
    }

    async emitToAllusers(user:User){
        let socketsId:string[] = [];
        const allfriends = await this.userService.getUserFriends({login:user.login});
        const convLogins = await this.userService.getLoginsConversationOfUser(user.UserId);
        const blockedby = await this.userService.getHaters({login:user.login});
        const ownerChannels:string[] = [] 
        this.existChannels.forEach((value, key) => {
            if (value.LoginOwner == user.login){
                ownerChannels.push(key);
                this.existChannels.delete(key)
            }
        });
        await this.userService.deleteAcoount(user.login);
        convLogins.forEach(login => {
            socketsId = this.userSockets.get(login);
            this.server.to(socketsId).emit('deleteAccount',{login:user.login, channels:ownerChannels});
        });
        allfriends.friends.forEach(element => {
            if (!convLogins.includes(element.login)){
                socketsId = this.userSockets.get(element.login);
                this.server.to(socketsId).emit('deleteAccount',{login:user.login, channels:ownerChannels});
        }});
        allfriends.pendingInvitation.forEach(element => {
            if (!convLogins.includes(element.login)){
                socketsId = this.userSockets.get(element.login);
                this.server.to(socketsId).emit('deleteAccount',{login:user.login, channels:ownerChannels});
            }});
        allfriends.waitToAccept.forEach(element => {
            if (!convLogins.includes(element.login)){
                socketsId = this.userSockets.get(element.login);
                this.server.to(socketsId).emit('deleteAccount',{login:user.login, channels:ownerChannels});
            }});
        blockedby.forEach(element => {
            if (!convLogins.includes(element.login)){
                socketsId = this.userSockets.get(element.login);
                this.server.to(socketsId).emit('deleteAccount',{login:user.login, channels:ownerChannels});
            }});
    }

    async deleteSocketFromMapUsers(id:string){
        const login = this.getLoginBySocketId(id);
        if (!login)
            return ;
        const index = this.userSockets.get(login).indexOf(id);
        this.userSockets.get(login).splice(index, 1);
        if(this.userSockets.get(login).length == 0){
            const dto:UpdateUserDto = {login:login, isOnline:false, inGame:undefined, username:undefined, avatar:undefined, enableTwoFa:undefined};   
            const updatedUser = await this.userService.updateUser(dto);
            await this.MsgToUpdatedfriends(updatedUser);
            this.connectedUsers.delete(login);
        }
    }

    // emit to all client with same login
    sendMsgToUser(login:string, msg:any, event:string){
        const clients = this.userSockets.get(login);
        clients.forEach((value) => {
            this.server.to(value).emit(`${event}`, msg);
        });
    }

    // join room to all socket of a login;
    joinSocketsToRoom(login:string, roomName:string){
        const clients = this.userSockets.get(login);
        clients.forEach((value) => {
            const socket = this.connectedSocket.get(value);
            socket.join(roomName);
        });
    }
    
    leaveRoom(login:string, roomName:string){
        const clients = this.userSockets.get(login);
        clients.forEach((value) => {
            const socket = this.connectedSocket.get(value);
            socket.leave(roomName);
        });
    }

    // handle connection user
    // Socket should contain a user's jwt to connect him succefully 
    // add socket id of any duplicated user login to a room and , instead of emiting to a client i will emit to room named (login)
    async handleConnection(client: Socket) {
        try{  
            const token = client.handshake.headers.authorization;
            const hashedToken:string = await createHash('sha256').update(token).digest('hex');
            if (this.blackListedJwt.has(hashedToken))
                throw new BadRequestException('this jwt token is black Listed you have re login');
            const decodedToken = await this.jwtService.verify(token,{secret:`${process.env.jwt_secret}`});
            const login = decodedToken.login;
            const user = await this.userService.findUser({login:login});
            if (this.userSockets.has(login))
                this.userSockets.get(login).push(client.id);
            else
                this.userSockets.set(login, [client.id]);
            this.connectedSocket.set(client.id,client);
            if (!this.connectedUsers.has(login))
                this.connectedUsers.set(login,user);
            const roomsToJoin = await this.chatService.getUserNameChannels({login:user.login});
            roomsToJoin.forEach((channelName) => {
                client.join(channelName);
            });
            if (this.userSockets.get(login).length == 1){
                // set status online in database
                const dto:UpdateUserDto = {login:user.login, isOnline:true, inGame:undefined, username:undefined, avatar:undefined, enableTwoFa:undefined};
                const updatedUser = await this.userService.updateUser(dto);
                this.connectedUsers.set(login,updatedUser);
                await this.MsgToUpdatedfriends(updatedUser);
            }
            console.log(`${user.login} had connected   ${client.id}`);
            client.emit('message',`welcome ${this.connectedUsers.get(login).username} you have connected succefully`);
        }
        catch(error){
            this.connectedSocket.delete(client.id);
            await this.deleteSocketFromMapUsers(client.id);
            client.emit('errorMessage', error);
            client.disconnect();
        }
    }

    // handle disconnection user
    async handleDisconnect(client: Socket) {
        try {
            const login = this.getLoginBySocketId(client.id);
            let user = this.connectedUsers.get(login);
            if (!user)
                throw new NotFoundException(`cant find sender User`);
                if (user.inGame) {
                    // should delete instance of game
                    if (this.worlds[user.login] && this.worlds[user.login].players.player1.client == client.id) {
                        this.server.to(user.login).emit('gameStatus', { msg: "Host left the game.." });
                        this.server.to(user.login).emit('ready', { msg: false });
                        this.worlds[user.login].clearGame()
                        delete this.worlds[user.login]
                        this.worlds[user.login] = null
                        const dto:UpdateUserDto = {login:user.login, isOnline:undefined, inGame:false, username:undefined, avatar:undefined, enableTwoFa:undefined};
                        user = await this.userService.updateUser(dto);
                        this.connectedUsers.set(login,user);
                        await this.MsgToUpdatedfriends(user);
                    }
                    // check if the disconnecting user is part of someone elses room
                    const roomJoined = userInGame(user.login, this.worlds)
                    if (roomJoined && this.worlds[roomJoined].players.player2.client == client.id) {
                        this.worlds[roomJoined].availablePaddles.push("right")
                        this.worlds[roomJoined].players.player2 = { user: null, client: null }
                        const dto:UpdateUserDto = {login:user.login, isOnline:undefined, inGame:false, username:undefined, avatar:undefined, enableTwoFa:undefined};
                        user = await this.userService.updateUser(dto);
                        this.connectedUsers.set(login,user);
                        await this.MsgToUpdatedfriends(user);
                    }
                }
    
            // set status offline in database
            client.emit("message", 'you have disonnected');
            console.log(`${user.login} had disconected  ${client.id}`);
            this.connectedSocket.delete(client.id);
            await this.deleteSocketFromMapUsers(client.id);
        }
        catch (error) {
            client.emit(error);
        }
    }

    @SubscribeMessage('gameDisconnection')
    async gameDisconnection(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
        const login = this.getLoginBySocketId(client.id);
        let user = this.connectedUsers.get(login);
        if (!user)
            throw new NotFoundException(`cant find sender User`);
        if (this.worlds[user.login] && this.worlds[user.login].players.player1.client == client.id) {
            this.server.to(user.login).emit('gameStatus', { msg: "Host left the game.." });
            this.server.to(user.login).emit('ready', { msg: false });
            this.worlds[user.login].clearGame()
            delete this.worlds[user.login]
            this.worlds[user.login] = null
            const dto:UpdateUserDto = {login:user.login, isOnline:undefined, inGame:false, username:undefined, avatar:undefined, enableTwoFa:undefined};
            user = await this.userService.updateUser(dto);
            await this.MsgToUpdatedfriends(user);
            this.connectedSocket.delete(client.id);
            await this.deleteSocketFromMapUsers(client.id);
        }
        // check if the disconnecting user is part of someone elses room
        const roomJoined = userInGame(user.login, this.worlds)
        if (roomJoined && this.worlds[roomJoined].players.player2.client == client.id) {
            this.worlds[roomJoined].availablePaddles.push("right")
            this.worlds[roomJoined].players.player2 = { user: null, client: null }
            this.connectedSocket.delete(client.id);
            await this.deleteSocketFromMapUsers(client.id);
            const dto:UpdateUserDto = {login:user.login, isOnline:undefined, inGame:false, username:undefined, avatar:undefined, enableTwoFa:undefined};
            user = await this.userService.updateUser(dto);
            await this.MsgToUpdatedfriends(user);
        }
    }

    //
    async checkQueue(login:string, worlds: {}) {
        let isBlocked:boolean = false;
        for (const user in worlds) {
            isBlocked = await this.userService.isBlockedMe({loginA:login, loginB:user});
            if (worlds[user] && worlds[user].openGame && worlds[user].availablePaddles.length && !isBlocked)
                return user
        }
        return null
    }

    @SubscribeMessage('joinRoom')
    async handleJoinRoom(@MessageBody() data: { roomId: string, obj: measurements, queue: boolean }, @ConnectedSocket() client: Socket) {
        try {
            const login = this.getLoginBySocketId(client.id);
            const user = this.connectedUsers.get(login);
            let { roomId, queue } = data;
            if (!user || !roomId || roomId == undefined)
                throw new BadRequestException('no such user');
            const roomJoined = userInGame(user.login, this.worlds)
            if (roomJoined) {
                client.emit('gameStatus', { msg: "you're already in a game" });
                throw new BadRequestException('already in game');
            }
            roomId = roomId.length ? roomId : user.login
            if (roomId === user.login) {
                let queueRoom = null;
                if (queue) {
                    queueRoom = await this.checkQueue(login, this.worlds)
                    if (queueRoom) {
                        this.world = this.worlds[queueRoom]
                        roomId = queueRoom
                    }
                }
                if (!queueRoom) {
                    this.world = new matterNode(this.server, roomId, data.obj, queue, client.id);// user.login   
                    this.world.onSettingScores(async (payload: any) => {
                        const { resultMatch } = payload
                        const result = await this.userService.storeMatch(resultMatch);
                        if (result)
                            client.emit('achiev', {})
                        this.sendMsgToUser(resultMatch.loginA,result.staticsA,`staticsGame`);
                        this.sendMsgToUser(resultMatch.loginB,result.staticsB,`staticsGame`);
                        // Handle the hello event here
                    });
                }
                if (!queueRoom) {
                    this.worlds[roomId] = this.world;
                    this.world.sendBallPosition();
                }
            }
            else if (this.worlds[roomId]) {
                this.world = this.worlds[roomId];
            }
            else {
                client.emit('ready', { msg: false });
                client.emit('gameStatus', { msg: "Room host is not connected" });
                throw new BadRequestException('owner must be connected to the channel to join it');
            }
            client.join(roomId); // add the client to the specified room
            const dto:UpdateUserDto = {login:user.login, isOnline:undefined, inGame:false, username:undefined, avatar:undefined, enableTwoFa:undefined};
            const userUpdate = await this.userService.updateUser(dto);
            await this.MsgToUpdatedfriends(userUpdate);
            this.world.handleConnection(client, user);
        }
        catch (error) {
            client.emit("errorMessage", error);
        }
    }

    // handle game invitation
    @SubscribeMessage('gameInvitation')
    async gameInvitation(@ConnectedSocket() client: Socket, @MessageBody() body: gameInvite) {
        try {
            const { receiver } = body;
            const login = this.getLoginBySocketId(client.id);
            const userSender = this.connectedUsers.get(login);
            if (!userSender)
                throw new NotFoundException(`cant find sender User`);
            const userReceiver = await this.userService.findUser({ login: receiver });
            if (userReceiver.login == userSender.login)
                throw new BadRequestException(`${receiver} cant send msg to ${receiver}`);
            // check if receiver had blocked client or opposite
            const IsEnemy = await this.userService.isBlockedMe({ loginA: userSender.login, loginB: receiver });
            if (IsEnemy)
                throw new BadRequestException(`cant send any msg to ${receiver}`);
            if (this.connectedUsers.has(userReceiver.login)) {
                this.sendMsgToUser(userReceiver.login, { sender: userSender.login, receiver: userReceiver.login }, 'gameInvitation')
            }
        }
        catch (error) {
            client.emit("errorMessage", error);
        }
    }

    // handle canceling of game invitation
    @SubscribeMessage('cancelGame')
    async cancelGame(@ConnectedSocket() client: Socket, @MessageBody() body: cancelGame) {
        try {
            const { host } = body;
            const login = this.getLoginBySocketId(client.id);
            let  userSender = this.connectedUsers.get(login);
            if (!userSender)
                throw new NotFoundException(`cant find sender User`);
            const userReceiver = await this.userService.findUser({ login: host });
            if (userReceiver.login == userSender.login)
                throw new BadRequestException(`${host} cant send msg to ${host}`);
            if (this.connectedUsers.has(userReceiver.login)) {
                if (userReceiver.inGame) {
                    // should delete instance of game
                    if (this.worlds[userReceiver.login]) {
                        this.server.to(userReceiver.login).emit('gameStatus', { msg: "invitation was canceled, fuck off" });
                        this.server.to(userReceiver.login).emit('ready', { msg: false });
                        this.worlds[userReceiver.login].clearGame();
                        delete this.worlds[userReceiver.login]
                        this.worlds[userReceiver.login] = null
                        const dto:UpdateUserDto = {login:login, isOnline:undefined, inGame:false, username:undefined, avatar:undefined, enableTwoFa:undefined};
                        userSender = await this.userService.updateUser(dto);
                        await this.MsgToUpdatedfriends(userSender);
                    }
                }
            }
        }
        catch (error) {
            client.emit("errorMessage", error);
        }
    }

    // create new channel
    @SubscribeMessage('newChannel')
    async createNewChannel(@ConnectedSocket() client:Socket, @MessageBody() body:newChannelDto){
        try{
            const {channelName,isPrivate , ispassword, password} = body;
            if (this.existChannels.has(body.channelName))
                throw new BadRequestException('Channel already exists');
            const login = this.getLoginBySocketId(client.id);
            const user = this.connectedUsers.get(login);
            if (!user)
                throw new NotFoundException('no such user 1');
            const dto:ChannelDto = {channelName:channelName,isPrivate:isPrivate, LoginOwner:user.login,ispassword:ispassword,password:password};
            const channel = await this.chatService.createNewChannel(dto);
            this.existChannels.set(channel.channelName,channel);
            this.joinSocketsToRoom(login, channel.channelName);
            // client.emit('message',`your Channel: ${channel.channelName} has been created`);
            const msg:string = `your Channel: ${channel.channelName} has been created`
            this.sendMsgToUser(login, msg,"createChannel");
        }
        catch(error){
            client.emit("errorChannel", error);
        }
    }

    // update channel  : turne it public or private , change Owner , avatar, or password
    @SubscribeMessage('updateChannel')
    async updateChannel(@ConnectedSocket() client:Socket, @MessageBody() body:newUpdateChannelDto){
        try{
            if (!this.existChannels.has(body.channelName))
                throw new BadRequestException('no such Channel');
            const login = this.getLoginBySocketId(client.id);
            const user = this.connectedUsers.get(login);
            if (!user)
                throw new NotFoundException('no such user');
            const dto:updateChannelDto = {userLogin:user.login, channelName:body.channelName, isPrivate:body.isPrivate, ispassword:body.ispassword, newPassword:body.newPassword, avatar:body.avatar};
            const channel = await this.chatService.updateChannel(dto);
            this.existChannels.set(channel.channelName,channel);
            const msg:any = {channelName:channel.channelName, message:`you have updated your channel ${channel.channelName}`};
            // this.sendMsgToUser(login, msg,"message");
            this.server.to(channel.channelName).emit("updateChannel", msg);
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
            const login = this.getLoginBySocketId(client.id);
            const user = this.connectedUsers.get(login);
            if (!user)
                throw new NotFoundException('no such user');
            const dto:deleteChannelDto = {channelName:body.channelName, LoginOwner:user.login };
            await this.chatService.deleteChannel(dto);
            this.existChannels.delete(body.channelName);
            this.server.to(body.channelName).emit('channelRemoved',{channelName:body.channelName});
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
            const login = this.getLoginBySocketId(client.id);
            const user = this.connectedUsers.get(login);
            if (!user)
                throw new NotFoundException('no such user');
            // add client as member to  database
            const dto:MemberChannelDto = {channelName:body.channelName,login:user.login,password:body.password};
            const memberShip = await this.chatService.createMemberChannel(dto);
            const channel = await this.chatService.findChannel({channelName:body.channelName});
            this.existChannels.set(channel.channelName,channel);
            this.joinSocketsToRoom(login, channel.channelName);
            // client.join(channel.channelName);
            const msg = {message:`you have been Joined to ${channel.channelName} channel`, channelName:channel.channelName, avatar:channel.avatar}
            this.sendMsgToUser(login, msg, 'join');
        }
        catch(error){
            client.emit('errorJoin', error);
        }
    }

    // 
    @SubscribeMessage('inviteMember')
    async  inviteMemberChannel(@ConnectedSocket() client:Socket, @MessageBody() body:InviteMemberChannelDto){
        try{
            if (!this.existChannels.has(body.channelName))
                throw new BadRequestException('no such Channel');
            const channel = this.existChannels.get(body.channelName)
            const login = this.getLoginBySocketId(client.id);
            const user = this.connectedUsers.get(login);
            if (!user)
                throw new NotFoundException('no such user');
            const memberShip = await this.chatService.addMember(body, user.login);
            //check if other user is connected
            if (this.connectedUsers.has(body.login))
            {
                this.joinSocketsToRoom(body.login, body.channelName);
                const msg:any = {message:`you have been Joined to ${channel.channelName} channel`, channelName:channel.channelName, avatar:channel.avatar};
                this.sendMsgToUser(body.login, msg, "joinOther");
            }
        }catch(error){
            client.emit('errorMessage',error);
        }
    }

    // delete member from a channel
    @SubscribeMessage('kickMember')
    async kickMemberFromChannel(@ConnectedSocket() client:Socket, @MessageBody() body:newDeleteMemberChannelDto){
        try{
                if (!this.existChannels.has(body.channelName))
                    throw new BadRequestException('no such Channel');
                const login = this.getLoginBySocketId(client.id);
                const user = this.connectedUsers.get(login);
                if (!user)
                    throw new NotFoundException('no such user');
                const dto:DeleteMemberChannelDto = {channelName:body.channelName, login:user.login, loginDeleted:body.loginDeleted};
                await this.chatService.deleteMemberShip(dto);
                if (this.connectedUsers.has(body.loginDeleted))
                {
                    this.leaveRoom(body.loginDeleted, body.channelName);
                    const msg:any = {message:`you have been kicked from ${body.channelName}`, channelName:body.channelName}
                    this.sendMsgToUser(body.loginDeleted, msg, "kick");
                }
            }
            catch(error){
                client.emit('errorMessage', error);
            }
        }
    
    @SubscribeMessage('leaveChannel')
    async leaveChannel(@ConnectedSocket() client:Socket, @MessageBody() body:newLeaveChannel){
        try {
            const login = this.getLoginBySocketId(client.id);
            const user = this.connectedUsers.get(login);
            if (!user)
                throw new BadRequestException('no such user');
            const dto:leaveChannel = {channelName:body.channelName,login:user.login};
            this.chatService.leaveChannel(dto);
            const channel = await this.chatService.findChannel({channelName:body.channelName});
            this.existChannels.set(channel.channelName,channel);
            this.leaveRoom(login, body.channelName);
            const msg:any = {message:`you have leaved ${dto.channelName}`};
            this.sendMsgToUser(login, msg, "message");
        }
        catch(error){
            client.emit('errorMessage', error);
        }
    }

    // update a member ban mute ...
    @SubscribeMessage('updateMember')
    async updateUser(@ConnectedSocket() client:Socket, @MessageBody() body:newUpdateMemberShipDto){
        try {
            const channel = this.existChannels.get(body.channelName)
            if (!channel)
                throw new BadRequestException('no such channel');
            const login = this.getLoginBySocketId(client.id);
            const user = this.connectedUsers.get(login);
            if (!user)
                throw new BadRequestException('no such user');
            const dto:updateMemberShipDto = {userLogin:user.login,channelName:body.channelName,loginMemberAffected:body.loginAffected, isMute:body.isMute, timeMute:body.timeMute, isBlacklist:body.isBlacklist, isAdmin:body.isAdmin}
            let memberShip = await this.chatService.updateMemberShip(dto);
            const ik = memberShip.userAffectedMemberShip;
            const actValues: string[] = Object.values(memberShip.acts);
            if (actValues.length == 0)
                throw new BadRequestException('you didnt change anything');
            const separator: string = " , ";
            const msgAct: string = actValues.join(separator);
            if (this.connectedUsers.has(body.loginAffected))
            {
                this.joinSocketsToRoom(body.loginAffected, body.channelName);
                const msg:any = {message:`${user.login}  had  ${msgAct} ${ik.login}`,login:ik.login, channelName:ik.channelName,isAdmin:ik.isAdmin, isMute:ik.isMute, isBlacklist:ik.isBlacklist, isOwner:ik.isOwner};
                this.sendMsgToUser(body.loginAffected, msg, "Update");
                // const userAffected = this.connectedUsers.get(ik.login);
                // this.server.to(ik.channelName).emit(`Update`,msg);
            }
        }
        catch(error){
            client.emit('errorMessage',error);
        }   
    }

    //
    async sendMsgChannel(roomName:string, msg:any, loginSender:string){
        const clientsInRoom:string[] = Array.from(this.server.sockets.adapter.rooms.get(roomName) || []);
        const haters = await this.userService.getLoginHaters(loginSender);
        clientsInRoom.forEach((clientId) => {
            if (!haters.includes(this.getLoginBySocketId(clientId)))
                this.server.to(clientId).emit(`${roomName}`,msg);
        });
    }

    // msg channel
    @SubscribeMessage('msgChannel')
    async newMsgChannel(@ConnectedSocket() client:Socket, @MessageBody() body:newMsgChannelDto){
        try{
            const {channelName, content}  = body
            const channel = this.existChannels.get(channelName)
            if (!channel)
                throw new BadRequestException('no such channel');
            const login = this.getLoginBySocketId(client.id);
            const user = this.connectedUsers.get(login);
            if (!user)
                throw new NotFoundException('no such user');
            const dto:msgChannelDto = {login:user.login, content:content, channelName:channelName}
            const msg = await this.chatService.newMsgChannel(dto);
            if (msg)
            {
                await this.sendMsgChannel(channelName,msg,login);
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
            const login = this.getLoginBySocketId(client.id);
            const user = this.connectedUsers.get(login);
            if (!user)
                throw new BadRequestException('no such user');
            const dto:UpdateUserDto = {login:user.login, isOnline:undefined, inGame:undefined,username:body.username, avatar:body.avatar, enableTwoFa:body.enableTwoFa};
            if (dto.username !== undefined)
            {
                const userwithSameUsername = await this.userService.findUserwithSameUsername(dto.username);
                if (userwithSameUsername && userwithSameUsername.username === dto.username)
                    throw new BadRequestException(`we have already a user with username ${dto.username}!`);
            }
            const updatedUser = await this.userService.updateUser(dto);
            if (updatedUser)
            {
                this.sendMsgToUser(login, updatedUser, 'updateUser');
                this.connectedUsers.set(login,updatedUser);
                // send to his friend
                if (body.avatar || body.username)
                    await this.MsgToUpdatedfriends(updatedUser);
            }
            else
                client.emit('updateUser', 'you had changed anything');
        }
        catch(error){
            client.emit('errorMessage', error);
        }
    }

    @SubscribeMessage('updateUsername')
    async updateAvatarUserEvent(@ConnectedSocket() client:Socket, @MessageBody() body:newUpdateUserDto){
        try{
            const login = this.getLoginBySocketId(client.id);
            const user = this.connectedUsers.get(login);
            if (!user)
                throw new BadRequestException('no such user');
            const dto:UpdateUserDto = {login:user.login, isOnline:undefined, inGame:undefined, username:body.username, avatar:body.avatar, enableTwoFa:body.enableTwoFa};
            if (dto.username !== undefined)
            {
                const userwithSameUsername = await this.userService.findUserwithSameUsername(dto.username);
                if (userwithSameUsername && userwithSameUsername.username === dto.username)
                    throw new BadRequestException(`we have already a user with username ${dto.username}!`);
            }
            const updatedUser = await this.userService.updateUser(dto);
            if (updatedUser)
            {
                this.connectedUsers.set(login,updatedUser);
                this.sendMsgToUser(login, updatedUser, 'updateUsername');
                if (body.avatar || body.username)
                    await this.MsgToUpdatedfriends(updatedUser);
            }
            else
                client.emit('updateUsername', 'you had changed anything');
        }
        catch(error){
            client.emit('errorMessageUpdateUsername', error);
        }
    }
    // handle private msg
    @SubscribeMessage('PrivateMessage')
    async handlePrivatemessage(@ConnectedSocket() client:Socket, @MessageBody() body:sendMsgSocket){
        try {
            const {receiver, content} = body;
            const login = this.getLoginBySocketId(client.id);
            const userSender = this.connectedUsers.get(login);
            if (!userSender)
                throw new NotFoundException(`cant find sender User`);
            const userReceiver = await this.userService.findUser({login:receiver});
            if (userReceiver.login == userSender.login)
                throw new BadRequestException(`${receiver} cant send msg to ${receiver}`);
            // check if receiver had blocked client or opposite
            const IsEnemy = await this.userService.isBlockedMe({loginA:userSender.login,loginB:receiver});
            if (IsEnemy)
                throw new BadRequestException(`cant send any msg to ${receiver}`);
            const res = await this.chatService.addNewMessage({sender:userSender.login,receiver:userReceiver.login, content:content});
            if (!res.msg)
                throw new BadRequestException(`cant send any msg to ${receiver}`);
            if (this.connectedUsers.has(userReceiver.login))
            {
                const message:any = {sender:userSender.login , senderUsername:userSender.username, senderAvatar:userSender.avatar, receiver:userReceiver.login, receiverUsername:userReceiver.username, receiverAvatar:userReceiver.avatar  ,content:content,sendAt:res.msg.sendAt};
                if (res.isFirst) // first msg
                    this.sendMsgToUser(userReceiver.login, `ched ched first msg in conversation`, "firstMsg");
                this.sendMsgToUser(userReceiver.login, message, "PrivateMessage");
            }

        }
        catch(error){
            client.emit("errorMessage", error);
        }
    }

    // event to blo9 someone or .remove block
    @SubscribeMessage('block')
    async blo9User(@ConnectedSocket() client:Socket, @MessageBody() body:newBlockDto){
        try{
            const login = this.getLoginBySocketId(client.id);
            const user = this.connectedUsers.get(login);
            if (!user)
                throw new BadRequestException('no such user');
            const dto:BlockDto = {login:user.login, blockedLogin:body.blockedLogin}
            if (body.stillEnemy)
            {
                await this.userService.blockUser(dto);
                this.sendMsgToUser(login, ` you have blocked ${body.blockedLogin}`, "message");
                this.sendMsgToUser(body.blockedLogin, ` ${login} had blocked `, "blockuser");
            }
            else
            {
                await this.userService.removeBlock(user.login,body.blockedLogin);
                this.sendMsgToUser(login, `you have deblocked ${body.blockedLogin}`, "message");
            }
        }
        catch(error){
            client.emit('errorMessage', error);
        }
    }

    // event to anvite friend 
    @SubscribeMessage('inviteFriend')
    async inviteFriend(@ConnectedSocket() client:Socket, @MessageBody() body:findUserDto){
        try {
            const login = this.getLoginBySocketId(client.id);
            const user = this.connectedUsers.get(login);
            if (!user)
                throw new BadRequestException('no such user');
            const otherUser = await this.userService.findUser({login:body.login});
            const dto:invitationDto = {senderLogin:user.login,receiverLogin:body.login};
            const bool = await this.userService.inviteFriend(dto);
            if (bool)
            {
                if (this.connectedUsers.has(otherUser.login))
                {
                    const msg = {message:`${user.login} had accepte your invitation `, login:user.login,username:user.username,avatar:user.avatar}
                    this.sendMsgToUser(otherUser.login,msg, "twoInvite" );
                    this.sendMsgToUser(user.login,msg, "twoInvite" );
                    // this.server.to(key).emit("twoInvite", {message:`${user.login} had accepte your invitation `, login:user.login,username:user.username,avatar:user.avatar})    
                }
                // client.emit('twoInvite',{message:` you and ${body.login} are  friends now`, login:otherUser.login,username:otherUser.username,avatar:otherUser.avatar});
            }
            else
            {
                if (this.connectedUsers.has(otherUser.login))
                {
                    const msg = {message:`${user.login} had invite you to be his friend `, login:user.login,username:user.username,avatar:user.avatar}
                    this.sendMsgToUser(otherUser.login,msg, "invite" );
                }
                    // this.server.to(key).emit("invite", {message:`${user.login} had invite you to be his friend `, login:user.login,username:user.username,avatar:user.avatar})
                    // client.emit('invite',{message:` you have invited ${body.login} as a friend`, login:otherUser.login,username:otherUser.username,avatar:otherUser.avatar});
            }
        }
        catch(error){
            client.emit('errorMessage', error);
        }
    }
    
    @SubscribeMessage('removeInvite')
    async removeInvite(@ConnectedSocket() client:Socket, @MessageBody() body:findUserDto){
        try {
            const login = this.getLoginBySocketId(client.id);
            const user = this.connectedUsers.get(login);
            if (!user)
                throw new BadRequestException('no such user');
            const dto:invitationDto = {senderLogin:user.login,receiverLogin:body.login};
            await this.userService.removeInvite(dto);
            // client.emit('cancelInvitation', {login:user.login, message:` you have removed invitaion to ${body.login}`});
            if (this.connectedUsers.has(body.login))
            {
                const msg:any =  {login:user.login, message:`${user.login}  have removed invitation that he sends  to you`}
                this.sendMsgToUser(body.login, msg, "cancelInvitation");
            }
        }
    
        catch(error){
            client.emit('errorMessage', error);
        }
    }

    @SubscribeMessage('acceptFriend')
    async acceptFriend(@ConnectedSocket() client:Socket, @MessageBody() body:acceptFriend){
        try {
            const login = this.getLoginBySocketId(client.id);
            const user = this.connectedUsers.get(login);
            if (!user)
                throw new BadRequestException('no such user');
            const dto:invitationDto = {senderLogin:body.login,receiverLogin:user.login};
            await this.userService.accepteFriend(dto, body.accepte);
            if (body.accepte)
            {
                if (this.connectedUsers.has(body.login))
                    this.sendMsgToUser(body.login,{login:user.login, avatar:user.avatar, username:user.username, message:`${user.login}  have accepte you as friend`} ,"accept");
            }
            else{
                if (this.connectedUsers.has(body.login))
                    this.sendMsgToUser(body.login,{login:user.login, message:`${user.login}  have decline your invitation`},"decline");
            }
        }
        catch(error){
            client.emit('errorMessage', error);
        }
    }

    @SubscribeMessage('removeFriend')
    async removeFriend(@ConnectedSocket() client:Socket, @MessageBody() body:findUserDto){
        try {
            const login = this.getLoginBySocketId(client.id);
            const user = this.connectedUsers.get(login);
            if (!user)
                throw new BadRequestException('no such user');
            const dto:FriendDto = {loginA:body.login,loginB:user.login};
            await this.userService.removeFriend(dto);
            if (this.connectedUsers.has(body.login))
                this.sendMsgToUser(body.login,{login:user.login, message:`${user.login}  have removed you from list friend`},"delete");
        }
        catch(error){
            client.emit('errorMessage', error);
        }
    }


    // we need a token jwt of that  user to blacklist it
    @SubscribeMessage('logout')
    async lougOut(@ConnectedSocket() client:Socket){
        console.log('logout');
        try {
            const login = this.getLoginBySocketId(client.id);
            const user = this.connectedUsers.get(login);
            if (!user)
                throw new BadRequestException('no such user');
            // get token from header socket , hash it and set it in map
            const token = client.handshake.headers.authorization;
            const hashedToken:string = await createHash('sha256').update(token).digest('hex');
            this.blackListedJwt.set(hashedToken,user.login);
            // set status offline in database
            const dto:UpdateUserDto = {login:login, isOnline:false, inGame:false, username:undefined, avatar:undefined, enableTwoFa:undefined};   
            const updatedUser = await this.userService.updateUser(dto);
            await this.MsgToUpdatedfriends(updatedUser);
            this.sendMsgToUser(login, `${user.login} had log out`, "logout");
            this.connectedSocket.delete(client.id);
            await this.deleteSocketFromMapUsers(client.id);
            client.disconnect();
        }
        catch(error){
            console.log('hello error')
            client.emit('errorMessage', error);
        }
    }

    @SubscribeMessage('deleteAccount')
    async deleteAccount(@ConnectedSocket() client:Socket){
        try{
            const login = this.getLoginBySocketId(client.id);
            const user = this.connectedUsers.get(login);
            if (!user)
                throw new BadRequestException('no such user');
            await this.emitToAllusers(user);
            this.sendMsgToUser(login, `${user.login} had delete his Account`, "deleteMyAccount");
        }
        catch(error){
            client.emit('errorMessage', error);
        }           
    }
}