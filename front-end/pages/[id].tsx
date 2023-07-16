import { useRouter } from "next/router";
import { useState } from "react";
import NotExist from "./NotExist";

const checkPage = () =>{
    if(useRouter().query.id)
        console.log(useRouter().query.id)
    return (
        <NotExist />
    )

}
export default checkPage;