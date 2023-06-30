import middleware from "./middleware"
import { useEffect, useContext } from "react";
import { MyContext } from "@/components/Context";
import Router from "next/router";
const router = Router; 
export default function Med (){
    const context = useContext(MyContext);
    useEffect(() => {
        // checks if the user is authenticated
        context?.token
        ? router.push("/Med")
        : router.push("/");
      }, [context?.token]);

    // middleware();
    return <div>hello Med</div>
}