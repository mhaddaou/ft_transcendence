import Image, { StaticImageData } from "next/image";
import Smia from '../image/smia.jpg'
import Mhaddaou from '../image/mhaddaou.jpg'
import Hastid from '../image/hastid.jpg'
import Amya from '../image/amya.jpg'

interface PropsCard{
    name : string,
    img : StaticImageData,
}

const Cards = (props : PropsCard) =>{
    return (
        <div className= ' md:w-1/4 bg-slate-200 flex flex-col p-6 space-y-8 shadow-2xl  shadow-cyan-600 items-center  rounded-lg border-4 border-slate-300'>
                <Image className='w-30 rounded-full ' src={props.img} alt='smia' />
                <p className='font-mono font-semibold border-b-4 border-slate-600 hover:border-cyan-500 text-slate-900 hover:text-cyan-800'>{props.name}</p>
        </div>
    );

}
export default Cards;