import Image from "next/image";
import Header from "@/components/Header";
import { Scrollbar } from "smooth-scrollbar/interfaces";
import Footer from "@/components/Footer";
import Router from "next/router";

class Animal{
    constructor(name : string){
        console.log(name);
    }
    ll(){
        
    }
}

class Dog extends Animal{
    constructor(name : string){
        super(name);
        super.ll();
    }
   
}

class Human{
    name: string;
    constructor(_name: string){
      this.name = _name;
    }
    getName(): string{
      return this.name;
    }
  }
const router = Router;
const Profile = ({tocken}:any)=>{
    
    console.log(tocken)
    let human = new Human('Mohamed Haddaoui');
    const SendInvite = () =>{

    };
    const SendMsg = () =>{
    };
    const img = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fsea.ign.com%2Favatar-generations&psig=AOvVaw3ds_D-lEUN4OLrM0cysOpO&ust=1684638550456000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCPC_6uT1gv8CFQAAAAAdAAAAABAE";
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-green-400 to-blue-500">
            <div className=" fixed  sm:w-full z-50">

            <Header  check={true} />
            </div>
        <center className="pt-32">


        <div className=" parent   grid grid-cols-6 px-2 min-w-fit sm:px-32 max-w-screen-xl pt-2 sm:pt-6 lg:pt-11 xl:pt-11  max-h-full">
            <div className="bg-gradient-to-r from-green-400 to-blue-500  col-span-2 row-span-6 m-2  rounded-3xl flex flex-col ">
                <div className="bg-gradient-to-r from-blue-400 to-green-400  col-span-6 row-span-2 m-2 flex flex-col items-center rounded-lg h-40 lg:h-60 sm:h-32">
                <Image className="bg-white w-14 h-14 rounded-full z-10 "  
                        alt="av" src="https://sm.ign.com/ign_ap/cover/a/avatar-gen/avatar-generations_hugw.jpg"
                        width={500} height={500}/>
                <div className="bg-gradient-to-r from-green-400 to-blue-500  relative -top-4 z-0 w-11/12 rounded-xl h-full text-white flex justify-center ">
                        {/* <div className="m-4 font-mono flex justify-center items-center sm:text-sm"> {tocken.login}</div> */}
                        <div></div>
                        <div></div>
                    </div>
                </div>
                <div className=" bg-gradient-to-r from-blue-400 to-green-400 col-span-6 row-span-2 m-2 rounded-lg  text-white h-full  overflow:hidden grid  grid-cols-2 grid-rows-2 gap-2"
               >
                   <div className="col-span-2 row-span-1  rounded-xl m-2  bg-gradient-to-r from-green-400 to-blue-500 shadow-3xl">
                    <div className=" flex justify-center m-2 font-mono ">History</div>
                    <div className=" text-xl m-1 p-1 overflow-y-auto scrollbar-thin scrollbar-track-violet-500 scrollbar-thumb-white "
                    style={{maxHeight:'calc(100vh - 1100px)'}}>
                       
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        <div className="flex flex-row justify-around ">lose vs mhaddaou</div>
                        
                        <div>lose</div>
                        
                    </div>


                   </div>
                   <div className="bg-gradient-to-r from-green-400 to-blue-500 col-span-2 m-2 rounded-xl grid shadow-2xl">
                   <div className=" flex justify-center m-2 font-mono text-lg ">Stats</div>
                   <div className="m-2 font-mono ">Victory : <span className="text-black text-xl relative -right-4 ">5</span></div>
                   <div className="m-2 font-mono ">Loss : </div>
                    
                   </div>
                </div>
            </div>
            <div className="bg-gradient-to-r from-green-400 to-blue-500 shadow-2xl inh col-span-4  m-2 rounded-2xl grid grid-cols-2 grid-rows-2 h-26 z-10">
                <div className="  rounded-3xl flex justify-around items-center col-span-2 max-h-full">
                    <button className="p-1 rounded-xl bg-gradient-to-r from-indigo-100 via-indigo-500 to-indigo-900 font-mono text-white" 
                    onClick={SendInvite}>  Connect</button>
                    <button className="p-1 rounded-xl bg-gradient-to-r from-indigo-100 via-indigo-500 to-indigo-900 font-mono text-white"
                    onClick={SendMsg}>  Message</button>

                </div>
                <div className="  bg-black rounded-3xl text-center text-white flex justify-center items-center col-span-2 h-5" >
                    level
                </div>
            </div>
            <div className="bg-gradient-to-r from-blue-400 to-green-400 shadow-2xl col-span-4 row-span-4 m-2 rounded-3xl grid grid-cols-4 grid-rows-4 "
                >
                <div className="bg-gradient-to-r from-green-400 to-blue-500 shadow-2xl col-span-2 row-span-2 m-2 rounded-3xl overflow-hidden "
                >
                <div className=" flex justify-center m-2 font-mono ">Achievements</div>
                <div className=" text-xl m-1 p-1 overflow-y-auto scrollbar-thin scrollbar-track-violet-500 scrollbar-thumb-white ">
                        
                        
                    </div>

                </div>
                <div className="bg-gradient-to-r from-green-400 to-blue-500 col-span-2 row-span-2 m-2 rounded-3xl scroll-auto shadow-2xl	"
                >
                <div className=" flex justify-center m-2 font-mono ">Friends</div>
                <div className=" text-xl m-1 p-1 overflow-y-auto scrollbar-thin scrollbar-track-violet-500 scrollbar-thumb-white ">
                        
                        
                    </div>
                </div>
                <div className="bg-gradient-to-r from-green-400 to-blue-500 col-span-2 row-span-2 m-2 rounded-3xl shadow-2xl"
                >
                <div className=" flex justify-center m-2 font-mono ">Achievements</div>
                <div className=" text-xl m-1 p-1 overflow-y-auto scrollbar-thin scrollbar-track-violet-500 scrollbar-thumb-white "
                    >
                        
                        
                    </div>
                </div>
                <div className="bg-gradient-to-r from-green-400 to-blue-500 col-span-2 row-span-2 m-2 rounded-3xl animate shadow-2xl"
                > 
                <div className=" flex justify-center m-2 font-mono ">Achievements</div>
                <div className=" text-xl m-1 p-1 overflow-y-auto scrollbar-thin scrollbar-track-violet-500 scrollbar-thumb-white ">

                </div>
                </div>

            </div>
            <div className="bg-gradient-to-r from-blue-400 to-green-400 col-span-4 m-2 rounded-3xl grid grid-rows-2 grid-col-2 shadow-2xl">
            <div className="col-span-1 row-span-1 bg-gradient-to-r from-green-400 to-blue-500  shadow-2xl rounded-3xl m-1 flex flex-col justify-center items-center font-extrabold">
                GUILD

                </div><div className="col-span-1 row-span-1 bg-gradient-to-r from-green-400 to-blue-500 shadow-2xl rounded-3xl m-1 flex justify-center items-center font-mono">
                Name Guild
                </div>

            </div>

        </div>
        </center>
        <div className="mt-auto">

        <Footer/>
        </div>
        
        </div>
    );

}

export default Profile;

