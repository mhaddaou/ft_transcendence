import { NextResponse } from "next/server";
import { MyContext } from "@/components/Context";
import { useContext } from "react";
export default function middleware(req : Request){
    const context = useContext(MyContext);
    console.log('hello world im middleware ')
    let url = req.url;
    if (!context?.token && url.includes('/Med')){
        return NextResponse.redirect('/');
    }
}