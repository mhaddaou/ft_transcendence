import { BlockDto, FriendDto, LoginDto, UpdateStats, UpdateStatus, UpdateUserDto, findUserDto, findUserOrChannel, invitationDto, storeMatchDto, usernameDto } from './dto/user.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Acheivement } from '@prisma/client';
import { PrismaService,  } from 'prisma/prisma.service';
import { Achievements } from './achievement.service';

@Injectable()
export class UserService {
    constructor(private prisma:PrismaService, private readonly achievements:Achievements){}

    async findAllUsers(){
        const resuslt = await this.prisma.client.user.findMany();
        return resuslt;
    }

    async findUser(findUser:findUserDto) {
        const {login} = findUser;
        const user = await this.prisma.client.user.findFirst({where:{login:login}});
        if (!user)
            throw new NotFoundException(`no such user with login ${login}`);
        return user;
    }

    async findUserWithUsername(dto:usernameDto){
        const user = await this.prisma.client.user.findFirst({
            where:{
                username: {
                    contains: dto.username.toLowerCase(),
                    mode: 'insensitive',
                },
            },
        });
        if (!user)
            throw new NotFoundException('no such user');
        return user.login;
    }

    async findUserById(id:string) {
        return await this.prisma.client.user.findUnique({where:{UserId:id}});
    }

    async findUserOrChannel(dto:findUserOrChannel, userLogin:string){
        let result:any[] = [];
        let users = await this.prisma.client.user.findMany({
            where: {
                NOT: {
                    login: userLogin,
                  },
                OR: [
                {
                  login: {
                    contains: dto.search.toLowerCase(),
                    mode: 'insensitive',
                  },
                },
                {
                  username: {
                    contains: dto.search.toLowerCase(),
                    mode: 'insensitive',
                  },
                },
              ],
            },
        });
        for(let i = 0;i < users.length ; ++i){
            if (await this.isRealFriend(users[i].login, userLogin))
                users.splice(i, 1); // remove that user from list search cause he is a friemd of 
        }
        result.push({userSearch:users});
        const channel = await this.prisma.client.channel.findMany({
            where:{
                channelName:{
                    contains: dto.search.toLowerCase(),
                    mode: 'insensitive',
                }
            }
        });
        result.push({channelSearch:channel});
        return result;
    }
    async createUser(loginDto:LoginDto){
        const user =  await this.prisma.client.user.create({
            data:{
                login: loginDto.login,
                username: loginDto.username,
                email:  loginDto.email,
                bioGra: "",
            }
        });
        await this.prisma.client.status.create({
            data:{
                user:{
                    connect:{
                        UserId:user.UserId,
                    }
                }
            }
        });
        
        await this.prisma.client.stats.create({
            data:{
                user:{
                    connect:{
                        UserId:user.UserId,
                    },
                },
            }
        });
        return user;
    }

    async deleteUser(findUser:findUserDto){
        const {login} = findUser;
        const user = await this.findUser(findUser);
        return await this.prisma.client.user.delete({where:{login:login}})
    }

    async lougOut(login:string){
        
    }

    // find user with same username
    async findUserwithSameUsername(username:string){
        return await this.prisma.client.user.findFirst({
            where:{
                username:username,
            },
        });
    }

    async updateUser(updateUser:UpdateUserDto){
        const {login, username, bioGra, avatar, enableTwoFa } = updateUser;
        let user = await this.findUser({login:login});
        let noChanges = true;
        if (bioGra !== undefined)
        {
            noChanges = false
            user = await this.prisma.client.user.update({
                where:{
                    login:user.login,
                },
                data:{
                    bioGra:bioGra,
                }
            });
        }
        if (avatar !== undefined)
        {
            noChanges = false
            user = await this.prisma.client.user.update({
                where:{
                    login:user.login,
                },
                data:{
                    avatar:avatar,
                }
            });
        }
        if (username !== undefined)
        {
            noChanges = false
            user = await this.prisma.client.user.update({
                where:{
                    login:user.login,
                },
                data:{
                    username:username,
                }
            });
        }
        if (enableTwoFa !== undefined)
        {
            noChanges = false
            user = await this.prisma.client.user.update({
                where:{
                    login:user.login,
                },
                data:{
                    enableTwoFa:enableTwoFa,
                }
            });
        }
        if (!noChanges)
            return user;
        return null;
    }

    // friendship
    async IsfriendOf(loginA:string, loginB:string){
        return await this.prisma.client.friend.findFirst({
            where:{
                loginA:loginA,
                loginB:loginB,
            }
        });
    }

    async isRealFriend(loginA:string, loginB:string){
        let friend = await this.IsfriendOf(loginA, loginB);
        if (friend && friend.isFriends)
            return true;
        friend = await this.IsfriendOf(loginB, loginA)
        if (friend && friend.isFriends)
            return true;
        return false;
    }

    // invitations
    async inviteFriend(dto:invitationDto){
        const {senderLogin, receiverLogin} = dto;
        const sender = await this.findUser({login:senderLogin});
        const receiver = await this.findUser({login:receiverLogin});
        if (sender.login === receiver.login)
            throw new BadRequestException('cant invite yourself');
        const friendA = await this.IsfriendOf(senderLogin,receiverLogin);
        const friendB = await this.IsfriendOf(receiverLogin,senderLogin);
        if ((friendA && friendA.isFriends) || (friendB && friendB.isFriends))
            throw new BadRequestException(' already friends');
        let senderToReceiver = await this.prisma.client.pendingFriendShip.findFirst({
            where:{
                senderLogin:sender.login,
                receiverLogin:receiver.login,
            }
        })
        if (senderToReceiver)
            throw new BadRequestException(' you have already invetation');
        let receiverToSender = await this.prisma.client.pendingFriendShip.findFirst({
        where:{
            senderLogin:receiver.login,
            receiverLogin:sender.login,
        }})
        if (receiverToSender)
        {
            await this.accepteFriend({senderLogin:receiverLogin, receiverLogin:senderLogin},true);
            return true;
        }   
        else
        {
            await this.prisma.client.pendingFriendShip.create({
            data:{
                sender:{
                    connect:{
                        UserId:sender.UserId
                    },
                },
                senderLogin:sender.login,
                receiver:{
                    connect:{
                        UserId:receiver.UserId
                    },
                },
                receiverLogin:receiver.login
            }
        })};
        return false;
    }
    
    // annuler intation
    async removeInvite(dto:invitationDto){
        const {senderLogin, receiverLogin} = dto;
        const sender = await this.findUser({login:senderLogin});
        const receiver = await this.findUser({login:receiverLogin});
        const pend = await this.prisma.client.pendingFriendShip.findFirst({
            where:{
                senderLogin:sender.login,
                receiverLogin:receiver.login,
            }
        });
        if (pend)
            await this.prisma.client.pendingFriendShip.delete({
                where:{
                    PendingId:pend.PendingId
            }});
        else
            throw new BadRequestException(`${senderLogin} had not invite ${receiverLogin}`);
    }

    async accepteFriend(dto:invitationDto, accepte:boolean){
        const {senderLogin, receiverLogin} = dto;
        const sender = await this.findUser({login:senderLogin});
        const receiver = await this.findUser({login:receiverLogin});
        const pend = await this.prisma.client.pendingFriendShip.findFirst({
            where:{
                senderLogin:sender.login,
                receiverLogin:receiver.login,
            }
        });
        if (!pend)
            throw new BadRequestException(`${senderLogin} had not invite ${receiverLogin}`);
        await this.prisma.client.pendingFriendShip.delete({
            where:{
                PendingId:pend.PendingId
            }
        });
        if (accepte)
        {
            const friendShip = await this.createFriendship({loginA:senderLogin,loginB:receiverLogin});
            await this.prisma.client.friend.update({
                where:{
                    FriendshipId:friendShip.FriendshipId,
                },
                data:{
                    isFriends:true,
                }
            });
        }
    }

    async createFriendship(friendDto:FriendDto){
        const {loginA, loginB} = friendDto;
        const userA = await this.findUser({login:loginA});
        const userB = await this.findUser({login:loginB});
        //check if userA added userB
        const frienda = await this.IsfriendOf(loginA, loginB);
        if (frienda && frienda.isFriends)
            throw new BadRequestException(`${loginA} and ${loginB} is already friends!`);
        if (frienda && !frienda.isFriends){
            return await this.prisma.client.friend.update({
                where:{
                    FriendshipId:frienda.FriendshipId,
                },
                data:{
                    isFriends:true,
                }
            });
        }
        // if userA friendOf userB  
        const friend = await this.IsfriendOf(loginB, loginA);
        if (friend)
        {
            if (!friend.isFriends)
                return await this.prisma.client.friend.update({
                    where:{
                        FriendshipId:friend.FriendshipId,
                    },
                    data:{
                        isFriends:true,
                    }
                });
            else
                throw new BadRequestException(`${loginA} and ${loginB} is already friends!`);
        }
        // last case , let's create new friendship
        return  await this.prisma.client.friend.create({
            data: {
                userA:{
                    connect:{
                        UserId:userA.UserId,
                    }
                },
                loginA: loginA,
                userB:{
                    connect:{
                        UserId:userB.UserId,
                    }
                },
                loginB:loginB,
                isFriends: false,
            }
        });
    }

    async getUserFriends(findUser:findUserDto){
        const {login} = findUser;
        const user = await  this.findUser(findUser);
        let friends:any[] = [];
        let pendingFriends:any[] = []
        let wToAccept:any[] = []

        const pending = await this.prisma.client.pendingFriendShip.findMany({
            where: {
              senderId: user.UserId,
            },
            select: {
              receiver: {
                select: {
                  login: true,
                  avatar: true,
                  username: true,
                },
              },
            },
          });
        pendingFriends = pending.map((pending) => pending.receiver);
        const waitingToAccept = await this.prisma.client.pendingFriendShip.findMany({
            where:{
                receiverId:user.UserId
            },
            select: {
                sender: {
                  select: {
                    login: true,
                    avatar: true,
                    username: true,
                  },
                },
              },
        });
        wToAccept = waitingToAccept.map((pending) => pending.sender);
        // list of friendship that added user(login)
        const friendAddedUser = await this.prisma.client.friend.findMany({
            where:{
                loginA:login,
                isFriends:true,
            },
            select:{
                userB:{
                    select:{
                        login:true,
                        avatar:true,
                        username:true,
                    }
                }
            }
        });
        const friendAdded = friendAddedUser.map((it) => it.userB);
        // list of friendship that addedBy user(login)
        const friendAddedbyUser = await this.prisma.client.friend.findMany({
            where:{
                loginB:login,
                isFriends:true,
            },
            select:{
                userA:{
                    select:{
                        login:true,
                        avatar:true,
                        username:true,
                    }
                }
            }
        });
        const friendAddedby = friendAddedbyUser.map((it) => it.userA);
        friends = friendAdded.concat(friendAddedby);
        return {friends:friends, pendingInvitation:pendingFriends, waitToAccept:wToAccept};
    }

    // delete a friend 
    async removeFriend(friendDto:FriendDto){
        const {loginA, loginB} = friendDto;
        const login = loginA;
        const removedLogin = loginB;
        const user = await  this.findUser({login:login});
        const removedUser = await  this.findUser({login:removedLogin});
        const friendshipA = await this.IsfriendOf(login, removedLogin);
        if (friendshipA)
        {
            if (friendshipA.isFriends)
            {
                return await this.prisma.client.friend.update({
                    where:{
                        FriendshipId:friendshipA.FriendshipId,
                    },
                    data:{
                        loginA:removedLogin,
                        loginB:login,
                        isFriends:false,
                    },
                });
            }
            else
                return await this.prisma.client.friend.delete({
                    where:{
                        FriendshipId:friendshipA.FriendshipId,
                    },
                });
        }
        const friendshipB = await this.IsfriendOf(removedLogin, login);
        if (friendshipB && friendshipB.isFriends)
            return await this.prisma.client.friend.update({
                where:{
                    FriendshipId:friendshipB.FriendshipId,
                },
                data:{
                    isFriends:false,
                },
            });
        throw new BadRequestException(`${login} and ${removedLogin} are not friends!`);
    }

    // block user
    async blockUser(blockDto:BlockDto){
        const login = blockDto.login;
        const blocked = blockDto.blockedLogin;
        const user = await  this.findUser({login:login});
        const blockedUser = await  this.findUser({login:blocked});
        const block = await this.prisma.client.block.findFirst({
            where:{
                blockedById:user.UserId,
                blockedId:blockedUser.UserId,
            }
        });
        if (!block)
        {
            await this.prisma.client.friend.deleteMany({
                where:{
                    loginA:login,
                    loginB:blocked
                }
            });
            await this.prisma.client.friend.deleteMany({
                where:{
                    loginA:blocked,
                    loginB:login
                }
            });
            let conv = await this.prisma.client.conversation.findFirst({
                where:{
                    loginA:login,
                    loginB:blocked
                }
            });
            if (!conv)
            {
                conv =await this.prisma.client.conversation.findFirst({
                where:{
                    loginA:blocked,
                    loginB:login
                }});
            }
            if (conv)
                await this.prisma.client.conversation.delete({
                    where:{
                        ConvId:conv.ConvId
                    }
                })
            return await this.prisma.client.block.create({
                data:{
                    blockBy:{
                        connect:{
                            UserId:user.UserId,
                        },
                    },
                    blockByLogin:login,
                    blocked:{
                        connect:{
                            UserId:blockedUser.UserId,
                        },
                    },
                    blockedLogin:blocked,
                },
            })
        }
        else
            throw new BadRequestException(`${login} already block ${blocked}`);
    }

    // remove block
    async removeBlock(login:string, blocked:string){
        const user = await  this.findUser({login:login});
        const blockedUser = await  this.findUser({login:blocked});
        const block = await this.prisma.client.block.findFirst({
            where:{
                blockedById:user.UserId,
                blockedId:blockedUser.UserId,
            }
        });
        if (block)
            return await this.prisma.client.block.delete({
                where:{
                    BlockId:block.BlockId,
                }
            })
        else
            throw new BadRequestException(`${login} didn't block ${blocked}`);
    }

    // get list of blocked users by  a user
    async getBlockedList(findUser:findUserDto){
        const result:any[] = [];
        const user = await  this.findUser(findUser);
        const blockedList = await this.prisma.client.block.findMany({
            where:{
                blockedById:user.UserId,
            },
            select:{
                blocked:{
                    select:{
                        login:true,
                    }
                }
            }
        });
        blockedList.forEach((it) => result.push(it.blocked.login));
        return result;
    }

    // get haters  (blocked by users)
    async getHaters(dto:findUserDto){
        const result:any[] = [];
        const user = await  this.findUser({login:dto.login});
        const haters = await this.prisma.client.block.findMany({
            where:{
                blockedId:user.UserId
            },
            select:{
                blockBy:{
                    select:{
                        login:true,
                    }
                }
            }
        });
        haters.forEach((it) => result.push(it.blockBy.login));
        return result;
    }

    // get logins of haters
    async getLoginHaters(login:string){
        const blocked = await this.getBlockedList({login:login});
        const haters = await this.getHaters({login:login});
        const result:any[] = blocked.concat(haters);
        return result;
    }

    // check if user blocked another user;
    async isBlockedMe(dto:FriendDto):Promise<boolean>{
        const userA = await this.findUser({login:dto.loginA});
        const userB = await this.findUser({login:dto.loginB});
        let block =  await this.prisma.client.block.findFirst({
            where:{
                blockedById:userA.UserId,
                blockedId:userB.UserId,
            },
        });
        if (!block){
            block =  await this.prisma.client.block.findFirst({
                where:{
                    blockedById:userB.UserId,
                    blockedId:userA.UserId,
                },
            });
        }
        if (!block){
            return false;
        }
        return true;

    }
// status
    // modify status of user
    async modifyStatusUser(updateStatus:UpdateStatus){
        const {login, isOnline, inGame} = updateStatus;
        const user = await this.findUser({login});
        let status = await this.prisma.client.status.findFirst({
            where:{
                userId:user.UserId,
            },
        });
        if (!status)
            return new NotFoundException('rfed');
        if (isOnline !== undefined){
            status = await this.prisma.client.status.update({
            where:{
                statusId:status.statusId,
            },
            data:{
                isOnline:isOnline,
            },
        });
        }
        if (inGame !== undefined){
            status = await this.prisma.client.status.update({
            where:{
                statusId:status.statusId,
            },
            data:{
                inGame:inGame,
            },
        });
        }
        return status;
    }

    // get status of user
    async getStatusUser(findUser:findUserDto){
        const user = await  this.findUser(findUser);
        return await this.prisma.client.status.findUnique({
            where:{
                userId:user.UserId,
            },
        });
    }

// stats
    // modify stats of user
    async modifyStatsUser(updateStats:UpdateStats){
        const {login, wins, losses, ladder} = updateStats;
        const user = await this.findUser({login});
        const stats = await this.prisma.client.stats.findFirst({
            where:{
                userId:user.UserId,
            },
        });
        if (!stats)
            return new NotFoundException();
        return await this.prisma.client.stats.update({
            where:{
                StatsId:stats.StatsId,
            },
            data:{
                wins:wins,
                losses:losses,
                ladder:ladder,
            },
        });
    }

    // get stats of user
    async getStatsUser(findUser:findUserDto){
        const user = await  this.findUser(findUser);
        return await this.prisma.client.stats.findUnique({
            where:{
                userId:user.UserId,
            },
        });
    }
// match
    // Achievement
    async getAcheivments(dto:findUserDto){
        const result:any[] = [];

        const user = await  this.findUser(dto);
        const achs = await this.prisma.client.acheivement.findMany({
            where:{
                userId:user.UserId
            }
        });
        for (let i = 0;i < achs.length; ++i){
            let ach = this.achievements.getAchievementById(achs[i].Id)
            result.push(ach);
        }
        return result;
    }

    async storeAchievement(login:string, userId:string, idAchievement:number){
        const achiev = await this.prisma.client.acheivement.findFirst({
            where:{
                Id:idAchievement,
                userId:userId
            }
        })
        if (!achiev)
        {
            return await this.prisma.client.acheivement.create({
               data:{
                   Id:idAchievement,
                   user:{
                       connect:{
                           UserId:userId,
                       },
                   },
                   login:login
               },
           });
        }
        return null;
    }

    async findNewAchievement(login:string, userId:string){
        const matchesA = await this.prisma.client.match.findMany({
            where:{
                userAId:userId,
            }
        });
        const matchesB = await this.prisma.client.match.findMany({
            where:{
                userBId:userId,
            },
        });
        let win = 0;
        let nmMatches = 0;
        let lose = 0;
        let result:Acheivement[] = [];
        if (matchesA)
            matchesA.forEach((match) => {
                if (match.winner)
                    win++;
                else
                    lose++;
                nmMatches++;
            });
        if (matchesB)
            matchesB.forEach((match) => {
                if (!match.winner)
                    win++;
                else
                    lose++;
                nmMatches++;
            })
        // First Game
        if (matchesA.length + matchesB.length == 1)
        {
            const ach = await this.storeAchievement(login,userId,1);
            if (ach)
                result.push(ach);
        }
        // Winning Streak
        if (win === 3)
        {
            const ach = await this.storeAchievement(login,userId,2);
            if (ach)
                result.push(ach);
        }
        // Paddle Prodigy
        if (win === 9)
        {
            const ach = await this.storeAchievement(login,userId,3);
            if (ach)
                result.push(ach);
        }
        // Never Give Up
        if (lose === 9)
        {
            const ach = await this.storeAchievement(login,userId,4);
            if (ach)
                result.push(ach);
        }
        // Ultimate Champion
        if (win === 21)
        {
            const ach = await this.storeAchievement(login,userId,5);
            if (ach)
                result.push(ach);
        }
        return result;
    }
    //store New finished match
    async storeMatch(matchDto:storeMatchDto){
        const {loginA, loginB, scoreA, scoreB, winner} = matchDto;
        const userA = await  this.findUser({login:loginA});
        const userB = await  this.findUser({login:loginB});
        await this.prisma.client.match.create({
            data:{
                userA:{
                    connect:{
                        UserId:userA.UserId,
                    },
                },
                scoreA:scoreA,
                userB:{
                    connect:{
                        UserId:userB.UserId,
                    },
                },
                scoreB:scoreB,
                winner:winner,
            }
        });
        if (winner)
        {
            await this.prisma.client.user.update({
                where:{
                    UserId:userA.UserId,
                },
                data:{
                    lvl:userA.lvl + 1,
                }
            });
            if (userB.lvl > 0)
            {
                await this.prisma.client.user.update({
                    where:{
                        UserId:userB.UserId,
                    },
                    data:{
                        lvl:userB.lvl - 1,
                    },
                });
            }
        }
        else
        {
            await this.prisma.client.user.update({
                where:{
                    UserId:userB.UserId,
                },
                data:{
                    lvl:userB.lvl + 1,
                },
            });
            if (userA.lvl > 0)
            {
                await this.prisma.client.user.update({
                    where:{
                        UserId:userA.UserId,
                    },
                    data:{
                        lvl:userA.lvl - 1
                    },
                });
            }
        }
        const achievA = await this.findNewAchievement(userA.login,userA.UserId);
        const acheivB = await this.findNewAchievement(userB.login, userB.UserId);
        return {achievA:achievA, acheivB:acheivB};
    }

    // get user's matchs history 
    async getHistoryUserMatchs(findUser:findUserDto){
        // const user = await  this.findUser(findUser);
        // let result:any[] = [];
        // let win:number = 0;
        // const matchsA =  await this.prisma.client.match.findMany({
        //     where:{
        //         userAId:user.UserId,
        //     },
        //     select: {
        //       userB: {
        //         select: {
        //           login: true,
        //           avatar: true,
        //           username: true,
        //         },
        //       },

        //     },
        // });
        const user = await  this.findUser(findUser);
        let result:any[] = [];
        let win:number = 0;
        const matchsA =  await this.prisma.client.match.findMany({
            where:{
                userAId:user.UserId,
            },
        });
        for (let i = 0;i < matchsA.length; ++i){
            let otherUser = await this.findUserById(matchsA[i].userBId);
            if (matchsA[i].winner)
                win++;
            const {scoreA, scoreB,winner, finishedAt} = matchsA[i];
            result.push({loginA:user.login,avatarA:user.avatar, usernameA:user.username, loginB:otherUser.login, avatarB:otherUser.avatar, usernameB:otherUser.username, winner:winner,scoreA:scoreA,scoreB:scoreB, finishedAt:finishedAt});
        }
        const matchsB =  await this.prisma.client.match.findMany({
            where:{
                userBId:user.UserId,
            },
        });
        for (let i = 0;i < matchsB.length; ++i){
            let otherUser = await this.findUserById(matchsB[i].userAId);
            if (matchsB[i].winner)
                win++;
            const {scoreA, scoreB,winner, finishedAt} = matchsB[i];
            result.push({loginA:user.login, avatarA:user.avatar, usernameA:user.username, loginB:otherUser.login, avatarB:otherUser.avatar, usernameB:otherUser.username, winner:winner,scoreA:scoreA,scoreB:scoreB, finishedAt:finishedAt});
        }
        const lose = result.length - win;
        const pWin =  win / result.length * 100;
        const pLose = lose / result.length * 100;
        result.push({pWin:pWin, pLose:pLose, numberOfMatches:result.length});
        return result;
    }


    // get history match one vs one
    async getHistoryOneVsOne(friendDto:FriendDto){
        const {loginA, loginB} = friendDto;
        const userA = await  this.findUser({login:loginA});
        const userB = await  this.findUser({login:loginB});
        const matchsA = await this.prisma.client.match.findMany({
            where:{
                userAId:userA.UserId,
                userBId:userB.UserId,
            },
        });

        const matchsB = await this.prisma.client.match.findMany({
            where:{
                userAId:userB.UserId,
                userBId:userA.UserId,
            },
        });
        return {...matchsA, ...matchsB};
    }

    async  getLeaderboard() {
        let leaderboard = await this.prisma.client.user.findMany({
            select:{
                login:true,
                username:true,
                avatar:true,
                lvl:true,
            },
            orderBy:{
                lvl:"desc",
            },
        });
        leaderboard = leaderboard.map((user, index) => {
            return {
              ...user,
              rank: index + 1,
            };
          });
        return leaderboard;
    }


    async deleteAcoount(login:string){
        await this.prisma.client.user.delete({
            where:{
                login:login
            }
        });
    }
    
}