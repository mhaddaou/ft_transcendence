import { StaticImageData } from "next/image";
import Avatar from "../image/avatar.webp";
import mhaddaou from '../image/mhaddaou.jpg';
import smia from '../image/smia.jpg';
class User{
    private name : string ='';
    private level : number = 0;
    private wins : number = 0;
    private losses : number = 0;
    private friends : string[] = [];
    private img : string = '';
    private levelper : number = 0;
    setName (newName : string){
        this.name = newName;
    }
    setLevel (level : number){
        this.level = level;
    }
    setWins (wins : number){
        this.wins = wins;
    }
    setLosses (losses : number){
        this.losses = losses;
    }
    setFriends (newFriends : string){
        this.friends.push(newFriends);
    }
    setImg (newImg : string){
        this.img = newImg;
    }
    setLevlPer(per : number){
        this.levelper = per;
    }
    getName(){
        return this.name;
    }
    getLevPer (){
        return this.levelper;
    }
    getImg(){
        return this.img;
    }
    getFriends(){
        return this.friends;
    }
    getLevel(){
        return this.level;
    }
    getWins() {
        return this.wins;
    }
    getLosses() {
        return this.losses;
    }
}

let Mhaddaou = new User;
Mhaddaou.setName('mhaddaou');
Mhaddaou.setImg('mhaddaou');
Mhaddaou.setFriends('smia');
Mhaddaou.setFriends('amya');
Mhaddaou.setLevel(8);
Mhaddaou.setLosses(35);
Mhaddaou.setWins(65);
Mhaddaou.setLevlPer(20);

let Smia = new User;
Smia.setName('smia');
Smia.setImg('smia');
Smia.setFriends('mhaddaou');
Smia.setLevel(10);
Smia.setLosses(35);
Smia.setWins(65);




export var Mymap = new Map<string,User>
Mymap.set(Mhaddaou.getName(), Mhaddaou);
Mymap.set(Smia.getName(), Smia);