import Image from "next/image";
import First from '../image/first.png'
import Footer from "./Footer";
const RealFooter = () =>{
    return (
        <footer>
            <div className=' h-full flex justify-center items-center  '>
                <Image className=" w-[800px]" src={First} width={200} height={200} alt='logo' />
            </div>
            <div className='py-8 bg-slate-200 shadow-2xl shadow-black '>
                <Footer />
            </div>
        </footer>

    );
}

export default RealFooter;