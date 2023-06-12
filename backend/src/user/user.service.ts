import { BlockDto, FriendDto, LoginDto, UpdateStats, UpdateStatus, UpdateUserDto, findUserDto, storeMatchDto, usernameDto } from './dto/user.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService,  } from 'prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma:PrismaService){}

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
                username:dto.username
            },
        });
        if (!user)
            throw new NotFoundException('no such user');
        return user.login;
    }

    async findUserById(id:string) {
        return await this.prisma.client.user.findUnique({where:{UserId:id}});
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

    async createFriendship(friendDto:FriendDto){
        const {loginA, loginB} = friendDto;
        const userA = await this.findUser({login:loginA});
        const userB = await this.findUser({login:loginB});
        //check if userA added userB
        const frienda = await this.IsfriendOf(loginA, loginB);
        if (frienda)
            throw new BadRequestException(`${loginA} and ${loginB} is already friends!`);
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
                        isFriends:true
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
        let result:any[] = [];
        // list of friendship that added user(login)
        const friendAddedUser = await this.prisma.client.friend.findMany({
            where:{
                loginA:login,
            },
        });
        for(let i = 0;i < friendAddedUser.length; ++i) {
            let otherUser = await this.findUser({login:friendAddedUser[i].loginB});
            const {loginA, loginB,isFriends } = friendAddedUser[i];
            result.push({loginA:loginA, loginB:loginB, isFriends:isFriends, avatar:otherUser.avatar, username:otherUser.username,})
        };
        // list of friendship that addedBy user(login)
        const friendAddedbyUser = await this.prisma.client.friend.findMany({
            where:{
                loginB:login,
                isFriends:true,
            },
        });
        for(let i = 0;i < friendAddedbyUser.length; ++i) {
            let otherUser = await this.findUser({login:friendAddedbyUser[i].loginA});
            const {loginA, loginB,isFriends } = friendAddedbyUser[i];
            result.push({loginA:loginB, loginB:loginA, isFriends:isFriends, avatar:otherUser.avatar, username:otherUser.username,})
        };
        return result;
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
        const user = await  this.findUser(findUser);
        const blockedList = await this.prisma.client.block.findMany({
            where:{
                blockedById:user.UserId,
            }
        });
    }

    // get haters  (blocked by users)
    async getHaters(dto:findUserDto){
        const user = await  this.findUser({login:dto.login});
        return await this.prisma.client.block.findMany({
            where:{
                blockedId:user.UserId
            }
        });
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

        // await this.prisma.client.match.findMany({
        //     where{

        //     }})
    }

    // get user's matchs history 
    async getHistoryUserMatchs(findUser:findUserDto){
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
            result.push({loginA:user.login, loginB:otherUser.login, winner:winner,scoreA:scoreA,scoreB:scoreB, finishedAt:finishedAt, avatar:otherUser.avatar, username:otherUser.username});
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
            result.push({loginA:user.login, loginB:otherUser.login, winner:winner,scoreA:scoreA,scoreB:scoreB, finishedAt:finishedAt, avatar:otherUser.avatar, username:otherUser.username});
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


    // get statique lose win for a user
    async isUserLoser(login:string){
        const user = await  this.findUser({login:login});
    }
}