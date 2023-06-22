import { MyContext, ContextTypes } from '@/components/Context';
import { useContext, useEffect, useState } from 'react';
import axios from "axios";
import QRCodeImage from '@/components/QRCodeImage';
import { useRouter } from "next/router";

function QrCode() {
  const [code, setCode] = useState("")
  const context = useContext(MyContext);
  const [QR, setQR] = useState("")
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/auth/QR",
          { login: context?.login },
          {
            headers: {
              Authorization: `Bearer ${context?.token}`,
            },
          }
        );
        setQR(res.data.qrImg)
        // http://localhost:5000/auth/2-FA post login code
      } catch (error) {
        // Handle the error here
        console.error(error);
      }
    };

    fetchData();
  }, [ context?.token]);
  const handleClick = async (e:any) => {
// console.log("handle click kkkkkkkkkk ", code)
    try {
      const res = await axios.post(
        "http://localhost:5000/auth/2-FA",
        {  code: `${code}`,
      login: context?.login },
        {
          headers: {
            Authorization: `Bearer ${context?.token}`,
          },
        }
      );
      // Handle the response data here
      if(res.data)
      router.push('http://localhost:3000/Dashbord');

      console.log("handle res")
      console.log(res.data)
    }
    catch (error) {
      console.error(error);
    }

  }
  const handleInput= (e:any)=>{
    setCode(e.target.value)
  }
  return (

    <div className='container mx-auto my-5 px-4 md:my-10'>

      <div className="flex  flex-row flex-wrap gap-2 justify-center ">
        <div className="border bg-black w-full shadow max-w-[450px] basis-1/1  md:basis-2/3">
          <QRCodeImage base64={QR} />
        </div>
        <div className=" basis-1/1 w-full max-w-[450px] border bg-slate-300 flex  flex-col items-center  justify-center md:basis-1/3 ">
          <div className='my-5 '>

            <label htmlFor="" className="">QR code</label>
            <input type="text" onChange={handleInput} className="max-w-[200px] h-10  bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
          </div>

          <button type="submit" onClick={handleClick}  className='my-5 p-2 text-white z-30 py-2 px-6 bg-slate-600 rounded-full self-center border-4 border-cyan-300 font-semibold  hover:border-cyan-800 hover:bg-slate-900 hover:text-white '>Sign in</button>

        </div>


      </div>
    </div>

  )
}

export default QrCode