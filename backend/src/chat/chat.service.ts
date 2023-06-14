import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ChannelDto, DeleteMemberChannelDto, MemberChannelDto, channeDto, deleteChannelDto, getConvDto, leaveChannel, msgChannelDto, sendMsgDto, updateChannelDto, updateMemberShipDto } from './Dto/chat.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { findUserDto } from 'src/user/dto/user.dto';
import * as moment from 'moment';
@Injectable()
export class ChatService {
    constructor(private readonly userService:UserService,
        private  prisma:PrismaService){}
    // check if two users had already a conversation ,
    // if not  i create new conv after that i create new msg
    // and assing it  to conv that it s belong to
    async addNewMessage(msgDto:sendMsgDto){
        const {sender, receiver, content} = msgDto;
        // check if sender or receiver exist in  database 
        const userA = await this.userService.findUser({login:sender});
        const userB = await this.userService.findUser({login:receiver});
                    
        // know we check if sender and receiver have already an conversation
        const convA = await this.prisma.client.conversation.findFirst({
            where:{
                loginA:userA.login,
                loginB:userB.login,
            },
        });

        const convB = await this.prisma.client.conversation.findFirst({
            where:{
                loginA:userB.login,
                loginB:userA.login,
            },
        });

        // set fromUserA  to true to know who send msg 
        if (convA)
        {
            return await this.prisma.client.message.create({
                data:{
                    content:content,
                    loginSender:sender,
                    loginReceiver:receiver,
                    fromUserA:true,
                    conversation:{
                        connect:{
                            ConvId:convA.ConvId,
                        },
                    },
                },
            });
        }
        if (convB)
        {
            return await this.prisma.client.message.create({
                data:{
                    content:content,
                    loginSender:sender,
                    loginReceiver:receiver,
                    fromUserA:false,
                    conversation:{
                        connect:{
                            ConvId:convB.ConvId,
                        },
                    },
                },
            });
        }

        // else userA and  userB first time they had a conversation so we create new one
        const conv =  await this.prisma.client.conversation.create({
            data:{
                userA:{
                    connect:{
                        UserId:userA.UserId,
                    },
                },
                loginA:userA.login,
                userB:{
                    connect:{
                        UserId:userB.UserId,
                    },
                },
                loginB:userB.login,
            },
        });

        return await this.prisma.client.message.create({
            data:{
                content:content,
                loginSender:sender,
                loginReceiver:receiver,
                fromUserA:true,
                conversation:{
                    connect:{
                        ConvId:conv.ConvId,
                    },
                },
            },
        });
    }

    // get conversation between two users
    async getConv(loginA:string, loginB:string){
        const conv = await this.prisma.client.conversation.findFirst({
            where:{
                loginA:loginA,
                loginB:loginB,
            },
        });
        if (conv)
            return await this.prisma.client.message.findMany({
                where:{
                    conversationId:conv.ConvId,
                },
            });
        return null;
    }

    async getConversation(getConv:getConvDto){
        const {loginA, loginB} = getConv;
        let result:any[] = [];
        // check if sender or receiver exist in  database 
        const userA = await this.userService.findUser({login:loginA});
        const userB = await this.userService.findUser({login:loginB});
        if ((userA.login == userB.login))
            throw new BadRequestException('sender and receiver cant be same');
        let conv = await this.getConv(loginA,loginB);
        if (conv){
            result.push({loginA:userA.login,loginB:userB.login,usernameA:userA.username, usernameB:userB.username, avatarA:userA.avatar, avatarB:userB.avatar});
        }
        if (!conv)
        {
            conv =  await this.getConv(loginB, loginA);
            if (conv)
                result.push({loginA:userB.login,loginB:userA.login,usernameA:userB.username, usernameB:userA.username, avatarA:userB.avatar, avatarB:userA.avatar});
        }
        result.push(conv);
        return result;
    }

// channel

    // create new channel
    async createNewChannel(channelDto:ChannelDto){
        const {channelName,isPrivate , LoginOwner, ispassword, password} = channelDto;
        let pass = await bcrypt.hashSync(`${process.env.default_pass_channel}`,10);
        if (password !== undefined)
        {
            pass = await bcrypt.hashSync(password,10);
        }
        // check if loginOwner exist in database;
        const user = await this.userService.findUser({login:LoginOwner});
        // check if there already an channel with same channelName
        const ch = await this.prisma.client.channel.findFirst({
            where:{
                channelName:channelName,
            },
        });
        if (ch)
            throw new NotFoundException(`there is already a channel with name ${channelName} `)
        // create new channel
        const channel = await this.prisma.client.channel.create({
            data:{
                channelName:channelName,
                LoginOwner:LoginOwner,
                ispassword:ispassword,
                password:pass,
                isPrivate:isPrivate,
            },
        });

        // now creating an MembershipChannel for the owner
        const memerShip = await this.prisma.client.membershipChannel.create({
            data:{
                isOwner:true,
                isAdmin:true,
                channel:{
                    connect:{
                        ChannelId:channel.ChannelId,
                    },
                },
                channelName:channel.channelName,
                login:user.login,
                user:{
                    connect:{
                        UserId:user.UserId,
                    },
                },

            },
        });
        return channel;
    }

    // delete a channel
    async deleteChannel(deleteChannel:deleteChannelDto){
            const {channelName, LoginOwner} = deleteChannel;
            const user = await this.userService.findUser({login:LoginOwner});
            const channel = await this.prisma.client.channel.findFirst({
                where:{
                    channelName:channelName,
                },
            });
            if (!channel)
                throw new NotFoundException(`no such channel: ${channelName}`);
            if (channel.LoginOwner !== LoginOwner)
                throw new NotFoundException(` ${LoginOwner} is not Owner of channel: ${channelName}`);
            return await this.prisma.client.channel.delete({
                where:{
                    ChannelId:channel.ChannelId,
                },
            });
        }

    // update channel : turne it public or private , change Owner , or password
    async updateChannel(updateCh:updateChannelDto){
        const {userLogin, channelName, isPrivate, ispassword, newPassword} = updateCh;

        const user = await this.userService.findUser({login:userLogin});
        let channel = await this.prisma.client.channel.findFirst({
            where:{
                channelName:channelName,
            },
        });
        if (!channel)
            throw new NotFoundException(`no such channel: ${channelName}`);
        if (channel.LoginOwner !== userLogin)
            throw new NotFoundException(`only owner can update his channel`);
        if (isPrivate !== undefined)
        {
            channel = await this.prisma.client.channel.update({
                where:{
                    ChannelId:channel.ChannelId,
                },
                data:{
                    isPrivate:isPrivate,
                },
            });
        }
        if (ispassword !== undefined)
        {
            channel = await this.prisma.client.channel.update({
                where:{
                    ChannelId:channel.ChannelId,
                },
                data:{
                    ispassword:ispassword,
                },
            });
        }
        if (newPassword !== undefined && channel.ispassword)
        {
            const pass = await bcrypt.hashSync(newPassword,10); 
            channel = await this.prisma.client.channel.update({
                where:{
                    ChannelId:channel.ChannelId,
                },
                data:{
                    password:pass,
                },
            });
        }
        return channel;
    }
 
    // create new MemberChannel
    async createMemberChannel(memberChannelDto:MemberChannelDto){
        const { channelName, login, password} = memberChannelDto;
        const user = await this.userService.findUser({login:login});
        // check if there already an channel with same channelName
        const channel = await this.prisma.client.channel.findFirst({
            where:{
                channelName:channelName,
            },
        });
        if (!channel)
            throw new NotFoundException(`no such channel with the name ${channelName}`)

        // check if user is already on that channel
        const memberShip = await this.prisma.client.membershipChannel.findFirst({
            where:{
                userId:user.UserId,
                channelId:channel.ChannelId,
            },
        });
        if (memberShip?.isBlacklist)
            throw new BadRequestException(`${login} is blacklisted from ${channelName}`);
        if (memberShip)
            throw new NotFoundException(` already a member of channel: ${channelName}`);
        if (channel.isPrivate)
            throw new BadRequestException(`${channelName} is a private channel cant join without an admin permission`);
        if (channel.ispassword)
        {
            if (password !== undefined)
            {
                const bool = await  bcrypt.compare(password,channel.password);
                if (!bool)
                    throw new NotFoundException(`uncorrect password`);
            }
            else
                throw new NotFoundException(`channel require a password to join`);
        }
        // check if channel has no owner
        if (channel.LoginOwner === "no one"){
            return await this.prisma.client.membershipChannel.create({
                data:{
                    channel:{
                        connect:{
                            ChannelId:channel.ChannelId,
                        },
                    },
                    channelName:channel.channelName,
                    login:user.login,
                    user:{
                        connect:{
                            UserId:user.UserId
                        },
                    },
                    isAdmin:true,
                    isOwner:true,
                },
            });
        }
        // create new memberShip
        return await this.prisma.client.membershipChannel.create({
            data:{
                channel:{
                    connect:{
                        ChannelId:channel.ChannelId,
                    },
                },
                channelName:channel.channelName,
                login:user.login,
                user:{
                    connect:{
                        UserId:user.UserId
                    },
                },
            },
        });
    }
    // leave channel
    async leaveChannel(dto:leaveChannel){
        const {channelName, login} = dto;
        const user = await this.userService.findUser({login:login});
        const channel = await this.prisma.client.channel.findFirst({
            where:{
                channelName:channelName,
            },
        });
        if (!channel)
            throw new NotFoundException(`no such channel: ${channelName}`);
        const LoginMember = await this.prisma.client.membershipChannel.findFirst({
            where:{
                login:login,
                channelName:channelName,
            },
        });
        if (!LoginMember)
            throw new NotFoundException(`${login} is not a member on ${channelName}`);
        if (LoginMember.isOwner)
        {
            let successor = await this.prisma.client.membershipChannel.findFirst({
                where:{
                    channelName:channelName,
                    isAdmin:true,
                    isOwner:false,
                },
            });
            if (!successor)
                successor = await this.prisma.client.membershipChannel.findFirst({
                    where:{
                        channelName:channelName,
                        isOwner:false
                    }
                });
            if (successor)
            {
                await this.prisma.client.membershipChannel.update({
                    where:{
                        MembershipId:successor.MembershipId,
                    },
                    data:{
                        isOwner:true,
                        isAdmin:true,
                    }
                })
                await this.prisma.client.channel.update({
                    where:{
                        ChannelId:channel.ChannelId,
                    },
                    data:{
                        LoginOwner:successor.login
                    }
                })
            }
            else
            {
                await this.prisma.client.channel.update({
                    where:{
                        ChannelId:channel.ChannelId,
                    },
                    data:{
                        LoginOwner:"no one",
                    }
                });
            }
        }
        return await this.prisma.client.membershipChannel.delete({
            where:{
                MembershipId:LoginMember.MembershipId
            },
        });
    }
    // delete a memberShip
    async  deleteMemberShip(deleteMember:DeleteMemberChannelDto){
        const {channelName, login, loginDeleted} = deleteMember;
        const user = await this.userService.findUser({login:login});
        const userDeleted = await this.userService.findUser({login:loginDeleted});
        const channel = await this.prisma.client.channel.findFirst({
                where:{
                    channelName:channelName,
                },
            });
        if (!channel)
            throw new NotFoundException(`no such channel: ${channelName}`);
        const LoginMember = await this.prisma.client.membershipChannel.findFirst({
            where:{
                login:login,
                channelName:channelName,
            },
        });
        const memberDeleted = await this.prisma.client.membershipChannel.findFirst({
            where:{
                login:loginDeleted,
                channelName:channelName,
            },
        });
        if (!memberDeleted || !LoginMember)
            throw new NotFoundException(`a member is not on ${channelName}`);
        if (memberDeleted.isOwner)
            throw new NotFoundException(`${loginDeleted} is owner you cannot delete it`);
        if (!LoginMember.isAdmin)
            throw new BadRequestException('only admin can kick members');
        return await this.prisma.client.membershipChannel.delete({
                where:{
                    MembershipId:memberDeleted.MembershipId,
                },
            });
    }

    // update memberShip , you can mute , blacklist , change nickName , set member an admin
    async   updateMemberShip(updateMember:updateMemberShipDto){
        const {userLogin, channelName, loginMemberAffected , isMute, timeMute, isBlacklist, isAdmin } = updateMember;
        let array:string[] = [];
        const user = await this.userService.findUser({login:userLogin});
        const userAffected = await this.userService.findUser({login:loginMemberAffected});
        const channel = await this.prisma.client.channel.findFirst({
            where:{
                channelName:channelName,
            },
        });
        if (!channel)
            throw new NotFoundException(`no such channel with the name ${channelName}`)

        const userMemberShip = await this.prisma.client.membershipChannel.findFirst({
            where:{
                login:userLogin,
                channelName:channel.channelName,
            },
        });
        let userAffectedMemberShip = await this.prisma.client.membershipChannel.findFirst({
            where:{
                login:loginMemberAffected,
                channelName:channel.channelName,
            },
        });

        if (!userAffectedMemberShip)
            throw new NotFoundException(`${loginMemberAffected} are not member`);
        if (!userMemberShip)
            throw new NotFoundException(`${userLogin} are not member`);
        if  (!userMemberShip.isAdmin && userAffectedMemberShip.isOwner)
            throw new NotFoundException(`${userLogin} is not admin, or ${loginMemberAffected} is owner `);
        if (isMute !== undefined)
        {
            if (isMute)
            {
                array.push('Mute');
                if (timeMute != undefined && timeMute >= 1)
                {
                    let timeToMute:Date = new Date();
                    timeToMute.setMinutes(timeToMute.getMinutes() + timeMute);
                    userAffectedMemberShip = await this.prisma.client.membershipChannel.update({
                        where:{
                            MembershipId:userAffectedMemberShip.MembershipId,
                        },
                        data:{
                            isMute:isMute,
                            timeMute:timeToMute,
                        },
                    });
                }
            }
            else{
                array.push('unMute');
                userAffectedMemberShip = await this.prisma.client.membershipChannel.update({
                    where:{
                        MembershipId:userAffectedMemberShip.MembershipId,
                    },
                    data:{
                        isMute:isMute,
                    },
                });
            }
        }
        if (isBlacklist !== undefined)
        {
            if (isBlacklist)
                array.push('Ban');
            else
                array.push('unBan');
            userAffectedMemberShip = await this.prisma.client.membershipChannel.update({
                where:{
                    MembershipId:userAffectedMemberShip.MembershipId,
                },
                data:{
                    isBlacklist:isBlacklist,
                },
            });
        }

        if (isAdmin !== undefined)
        {
            if (isAdmin)
                array.push('Promote');
             else
                array.push('deMote');
            userAffectedMemberShip = await this.prisma.client.membershipChannel.update({
                where:{
                    MembershipId:userAffectedMemberShip.MembershipId,
                },
                data:{
                    isAdmin:isAdmin,
                },
            });
        }
        return {acts:array,userAffectedMemberShip};
    }

    // new messsage channel
    async newMsgChannel(msgDto:msgChannelDto){
        const {login, content, channelName} = msgDto;
        const user = await this.userService.findUser({login:login});
        // check if there already an channel with same channelName
        const channel = await this.prisma.client.channel.findFirst({
            where:{
                channelName:channelName,
            },
        });
        if (!channel)
            throw new NotFoundException(`no such channel with the name ${channelName}`)
        // check if user is already on that channel
        const memberShip = await this.prisma.client.membershipChannel.findFirst({
            where:{
                userId:user.UserId,
                channelId:channel.ChannelId,
            },
        });
        if (!memberShip)
            throw new NotFoundException(`${login} is not a member on channel: ${channelName}`);
        // check if user is muted or blacklisted
        if (memberShip.isBlacklist)
            throw new NotFoundException(`${login} is  a blacklisted  member on channel: ${channelName}`);
        if (memberShip.isMute){
            const timeToMute:Date = memberShip.timeMute;
            const now: Date = new Date();
            const timeDifference: number = timeToMute.getTime() - now.getTime();
            if (timeDifference > 0) {
                const milliseconds = Math.abs(timeDifference);
                const hours = Math.floor(milliseconds / (1000 * 60 * 60));
                const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
                const seconds = Math.floor((milliseconds / 1000) % 60);
                throw new BadRequestException(`You are muted for ${hours} hours, ${minutes} minutes, and ${seconds} seconds.`)
            }
        }
        return await this.prisma.client.msgChannel.create({
            data:{
                login: user.login,
                content: content,
                channel: {
                    connect: {
                        ChannelId: channel.ChannelId,
                    }
                },
                channelName: channel.channelName,
            },
        });
    }


    // get all channels
    async getAllChannels(){
        return await this.prisma.client.channel.findMany({
            where:{
                isPrivate:false,
            }
        });
    }

    // members of a channel
    async getMembersOfChannel(chDto:channeDto){
        const {channelName} = chDto;
        const channel = await this.prisma.client.channel.findFirst({
            where:{
                channelName:channelName,
            },
        });
        if (!channel)
            throw new NotFoundException(`no such channel with the name ${channelName}`);
        return await this.prisma.client.membershipChannel.findMany({
            where:{
                channelName:channel.channelName,
            },
        });
    }

    // get conversation  channel 
    async getConversationChannel(chDto:channeDto){
        const {channelName} = chDto;
        const channel = await this.prisma.client.channel.findFirst({
            where:{
                channelName:channelName,
            },
        });

        if (!channel)
            throw new NotFoundException(`no such channel with the name ${channelName}`);
        return await this.prisma.client.msgChannel.findMany({
            where:{
                channelName:channel.channelName,
            },
        });
    }

    // user's memberShips
    async getUserChannels(userDto:findUserDto){
        const {login} = userDto;
        const user = await this.userService.findUser({login:login});
        return await this.prisma.client.membershipChannel.findMany({
            where:{
                login:user.login,
            },
        });
    }

    // find channel
    async findChannel(dto:channeDto){
        const {channelName} = dto;
        return await this.prisma.client.channel.findFirst({
            where:{
                channelName:channelName,
            },
        });
    }

    async getUserNameChannels(login:findUserDto):Promise<string[]>{
        let arr:string[] = [];
        const memberShips = await this.getUserChannels(login);
        memberShips.forEach((memberShip) => {
            arr.push(memberShip.channelName);
        });
        return arr;
    }

    async getConversationsOfUser(dto:findUserDto){
        let resulte:any[] = [];
        const {login} = dto;
        const user = await this.userService.findUser({login:login});
        const convA = await this.prisma.client.conversation.findMany({
            where:{
                loginA:login
            }
        });
        for(let i = 0; i < convA.length; i++){
            let otherUser = await this.userService.findUser({login:convA[i].loginB});
            let otherUserState = await this.userService.getStatusUser({login:otherUser.login});
            resulte.push({login:otherUser.login, username:otherUser.username, avatar:otherUser.avatar, isOnline:otherUserState.isOnline, inGame:otherUserState.inGame});  
        }
        const convB = await this.prisma.client.conversation.findMany({
            where:{
                loginB:login
            }
        });
        for(let i = 0; i < convB.length; i++){
            let otherUser = await this.userService.findUser({login:convB[i].loginA});
            let otherUserState = await this.userService.getStatusUser({login:otherUser.login});
            resulte.push({login:otherUser.login, username:otherUser.username, avatar:otherUser.avatar, isOnline:otherUserState.isOnline, inGame:otherUserState.inGame}); 
        }
        return resulte;
    }
    
}

