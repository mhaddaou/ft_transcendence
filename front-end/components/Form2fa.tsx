import { useContext, useEffect, useState } from "react";
import { MyContext } from '@/components/Context';
import axios from "axios";
import { checkIs7rag } from "./Functions";


const Form2fa = () => {
    const context = useContext(MyContext);
    const [twofac, setTwoFac] = useState(context ? context.enableTwoFa : false )


    useEffect(() => {
        setTwoFac(context ? context.enableTwoFa : false )
    },[context?.enableTwoFa])

    async function fetchdata(tokene: string) {
        try {
            const res = await axios.get(`${process.env.ME}`, {
                headers: {
                    Authorization: `Bearer ${tokene}`
                }
            })
            const response = await res.data;


            return response;
        } catch (e) {
        }
    }
    useEffect(() => {
        const fetchInfo = async () => {
            if (context){

                const userInfo =  await fetchdata(context?.token)
                if (userInfo)
                setTwoFac(userInfo.enableTwoFa)
            }
        }
        fetchInfo()
    })
    const handl2th = async () => {

    if (context){
        const userInfo = await fetchdata(context?.token)
        context.setEnableTwofa(!context.enableTwoFa)
        if (context?.token)
            checkIs7rag(context?.token);
        context?.socket?.emit("updateUser",{
            enableTwoFa: !context.enableTwoFa
        })

    }
        //two-factor authentication
    }

    return (
        <form className="w-full max-w-sm">
            <div className="flex items-center border-b border-slate-600 py-2">
                <button onClick={handl2th} className="flex-shrink-0 bg-slate-500 hover:bg-slate-700 border-slate-500 hover:border-slate-700 text-sm border-4 text-white py-1 px-2 rounded" type="button">
                   {!twofac ?  "enable two-factor authentication" : "disable two-factor authentication"}
                </button>
            </div>
        </form>

    );
}

export default Form2fa;