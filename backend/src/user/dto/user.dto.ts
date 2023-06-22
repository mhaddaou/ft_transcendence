import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class TwoFADto{
    @IsString()
    login:string;
    @IsString()
    code:string;
}
export class LoginDto  {
    @IsString()
    
    login:      string;
    @IsString()
    username:   string;
    @IsString()
    email:      string;
}


export class findUserDto {
    @IsString()
    login:string;
}

export class FriendDto {
    @IsString()
    loginA: string;
    @IsString()
    loginB: string;
}

export class BlockDto {
    @IsString()
    login: string;
    @IsString()
    blockedLogin: string;
}

export class UpdateUserDto {
    @IsString()
    login:string;
    @IsOptional()
    @IsString()
    username:string;
    @IsOptional()
    @IsString()
    bioGra:string;
    @IsOptional()
    @IsString()
    avatar:string;
    @IsOptional()
    @IsBoolean()
    enableTwoFa:boolean;
}

export class UpdateStatus {
    @IsString()
    login:string;
    @IsOptional()
    @IsBoolean()
    isOnline: boolean;
    @IsOptional()
    @IsBoolean()
    inGame: boolean;
}

export class UpdateStats{
    @IsString()
    login:string;
    @IsNumber()
    wins: number;
    @IsNumber()
    losses: number;
    @IsNumber()
    ladder: number;
}


export class findUserOrChannel {
    @IsString()
    @IsNotEmpty()
    search:string;
}


export class storeMatchDto {
    @IsString()
    loginA:string;
    @IsString()
    loginB:string;
    @IsNumber()
    scoreA: number;
    @IsNumber()
    scoreB: number;
    @IsBoolean()
    winner: boolean;
}

// for Socket
export class newBlockDto {
    @IsString()
    blockedLogin:string;
    @IsBoolean()
    stillEnemy:boolean;// true: add new block , false: remove block 
}

export class newFriendDto {
    @IsString()
    login: string;
    @IsBoolean()
    bool: boolean; // true: add new friend , false: remove friend 
}

export class newUpdateUserDto {
    @IsOptional()
    @IsString()
    username:string;
    @IsOptional()
    @IsString()
    bioGra:string;
    @IsOptional()
    @IsString()
    avatar:string;
    @IsOptional()
    @IsBoolean()
    enableTwoFa:boolean;
}

export class jwtToken {
    @IsString()
    token:string;
}

export class usernameDto{
    @IsString()
    username:string;
}

// invitation
export class invitationDto {
    @IsString()
    senderLogin:string;
    @IsString()
    receiverLogin:string;
}

export class acceptFriend {
    @IsString()
    login:string;
    @IsBoolean()
    accepte:boolean;
}