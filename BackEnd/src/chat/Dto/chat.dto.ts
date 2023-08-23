import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, isBoolean, isNotEmpty } from "class-validator";

export class sendMsgDto {
    @IsString()
    sender:string;
    @IsString()
    receiver:string;
    @IsString()
    content:string;
}


export class getConvDto {
    @IsString()
    loginA:string;
    @IsString()
    loginB:string;
}

// create new
export class ChannelDto {
    @IsString()
    @IsNotEmpty()
    channelName:string;
    @IsBoolean()
    isPrivate:boolean;
    @IsString()
    LoginOwner:string;
    @IsBoolean()
    ispassword:boolean;
    @IsString()
    @IsOptional()
    password:string;
}
export class newChannelDto {
    @IsString()
    @IsNotEmpty()
    channelName:string;
    @IsBoolean()
    isPrivate:boolean;
    @IsBoolean()
    ispassword:boolean;
    @IsString()
    @IsOptional()
    password:string;
}

export class MemberChannelDto {
    @IsString()
    @IsNotEmpty()
    channelName:string;
    @IsString()
    login:string;
    @IsOptional()
    @IsString()
    password:string;
}

export class msgChannelDto {
    @IsString()
    login:string;
    @IsString()
    content:string;
    @IsString()
    @IsNotEmpty()
    channelName:string;
}

// delete 
export class deleteChannelDto {
    @IsString()
    channelName:string;
    @IsString()
    LoginOwner:string;
}

export class DeleteMemberChannelDto {
    @IsString()
    channelName:string;
    @IsString()
    login:string;
    @IsString()
    loginDeleted:string;
}

// update channel
export class updateChannelDto {
    @IsString()
    userLogin:string;
    @IsString()
    channelName:string;
    @IsOptional()
    @IsBoolean()
    isPrivate:boolean;
    @IsOptional()
    @IsBoolean()
    ispassword:boolean;
    @IsString()
    @IsOptional()
    newPassword:string;
    @IsString()
    @IsOptional()
    avatar:string
}

export class updateMemberShipDto{
    @IsString()
    userLogin:string
    @IsString()
    channelName:string;
    @IsString()
    loginMemberAffected:string;
    @IsOptional()
    @IsBoolean()
    isMute:boolean;
    @IsOptional()
    @IsNumber()
    timeMute:number
    @IsOptional()
    @IsBoolean()
    isBlacklist:boolean;
    @IsOptional()
    @IsBoolean()
    isAdmin:boolean;
    
}

export class channeDto {
    @IsString()
    channelName:string;
}

export class leaveChannel{
    @IsString()
    channelName:string;
    @IsString()
    login:string;
}

// Socket

export class sendMsgSocket {
    @IsString()
    receiver:string;
    @IsString()
    content:string;
}


export class sendChannelMsgSocket {
    @IsString()
    channelName:string;
    @IsString()
    content:string;
}


export class newLeaveChannel{
    @IsString()
    channelName:string;
}


export class newMemberChannelDto {
    @IsString()
    @IsNotEmpty()
    channelName:string;
    @IsOptional()
    @IsString()
    password:string;
}

export class newMsgChannelDto {
    @IsString()
    @IsNotEmpty()
    channelName:string;
    @IsString()
    content:string;
}

// update channel
export class newUpdateChannelDto {
    @IsString()
    channelName:string;
    @IsOptional()
    @IsBoolean()
    isPrivate:boolean
    @IsOptional()
    @IsBoolean()
    ispassword:boolean;
    @IsOptional()
    @IsString()
    newPassword:string;
    @IsOptional()
    @IsString()
    avatar:string
}

export class newDeleteChannelDto {
    @IsString()
    channelName:string;
}

export class newDeleteMemberChannelDto {
    @IsString()
    channelName:string;
    @IsString()
    loginDeleted:string;
}

export class newUpdateMemberShipDto{
    @IsString()
    channelName:string;
    @IsString()
    loginAffected:string;
    @IsOptional()
    @IsBoolean()
    isMute:boolean;
    @IsOptional()
    @IsNumber()
    timeMute:number
    @IsOptional()
    @IsBoolean()
    isBlacklist:boolean;
    @IsOptional()
    @IsBoolean()
    isAdmin:boolean;
}


export class gameInvite {
    @IsString()
    receiver:string;
}

export class cancelGame {
    @IsString()
    host:string
}

export class InviteMemberChannelDto {
    @IsString()
    channelName:string;
    @IsString()
    login:string;
}