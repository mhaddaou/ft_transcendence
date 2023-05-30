import Barl from "@/components/Barl";
import NavBar from "@/components/NavBar";
import RealFooter from "@/components/RealFooter";

const NewChat = () =>{
    return (
        <div className="bg-gradient-to-t from-gray-100 to-gray-400 min-h-screen">
            <div className="container w-full mx-auto h-screen min-h-[1024px] flex flex-row py-2 gap-2">
                <Barl page="Chat"/>
                <div className="w-full h-full rounded-2xl flex flex-col  gap-2 ">
                <NavBar page="Chat"/>
                    <div className="w-full h-[95%] rounded-2xl bg-gray-300 flex gap-1">
                        <div className="w-full md:w-1/3 rounded-2xl bg-red-400 flex">
                            
                        </div>
                        <div className="hidden md:flex w-2/3 rounded-2xl md:flex-col gap-1">
                            <div className="w-full rounded-2xl bg-red-200 h-[5%]">

                            </div>
                            <div className="w-full rounded-2xl bg-blue-400 h-[95%]">

                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <RealFooter />
        </div>
    );
   

}

export default NewChat;