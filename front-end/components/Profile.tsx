import Link from "next/link";
import Image from "next/image";
import User from '../image/profilehover.svg' 

const Profile = () =>{
    return (
        <Link className="flex items-center justify-start w-full p-4 my-2 font-thin text-blue-500 uppercase transition-colors duration-200 border-r-4 border-blue-500 bg-gradient-to-r from-white to-blue-100 dark:from-gray-700 dark:to-gray-800" href="#">
                           <span className="text-left">
                               <Image className="w-8 " alt="user" src={User} />
                           </span>
                           <span className="mx-4 text-sm font-normal self-end">
                               Profile
                           </span>
                       </Link>
    );

}
export default Profile;