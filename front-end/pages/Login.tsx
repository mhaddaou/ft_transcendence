import Image from "next/image";
import Datausers from '@/components/users.json'

import { useContext, useRef, useState } from "react";
import { MyContext } from "@/components/Context";
import Router from "next/router";
import Link from "next/link";
const Login = () =>{
  const router = Router;
    const context = useContext(MyContext);
    const mm = useRef<HTMLInputElement | null>(null);
    const [username, setUsername] = useState('');
    const [friends, setFriends] = useState([]);

      const click = () =>{

        console.log("clicked")
        console.log(mm.current?.value)
        if (mm.current){
          setUsername(mm.current.value);
          Datausers.users.map((user) =>{
            if (user.name === username){
              context?.setName(username);
              context?.setImg(user.img);
              () =>{
                
              }
            }
          })
        }

      }

    
    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
  </div>
  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form className="space-y-6" action="#" method="POST">
      <div>
        <label  className="block text-sm font-medium leading-6 text-gray-900">User Name</label>
        <div className="mt-2">
        <input
                id="username"
                name="username"
                type="text"
                ref={mm}
                // value={username}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
        </div>
      </div>

      <div>
      </div>

      <div>
        {/* <button onClick={click}  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button> */}
      <Link onClick={click} href="http://localhost:3000/Dashbord">click</Link>
      </div>
    </form>


  </div>
</div>
    );
}

export default Login;