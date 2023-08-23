import { faTableTennis, faTableTennisPaddleBall } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";


export default function HBest() {
  return (
    <nav className="container mx-auto p-6 ">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faTableTennisPaddleBall} flip size="2xl" />                
            <h1 className=" font-bold border-b-4 border-emerald-400 rounded-md text-slate-700">
              <span className="font-black text-xl">

              P
              </span>
              ing
              <span className="font-black text-xl">

              P
              </span>
              ong</h1>
            </div>
            <div className="hidden md:flex items-center space-x-6 font-semibold text-slate-500 font-mono">
                <Link className=" font-mono hover:border-b-4 hover:border-emerald-300 hover:text-slate-800 rounded-md" href="#">Home</Link>
                <Link className=" font-mono hover:border-b-4 hover:border-emerald-300 hover:text-slate-800 rounded-md" href="#">Chat</Link>
                <Link className=" font-mono hover:border-b-4 hover:border-emerald-300 hover:text-slate-800 rounded-md" href="#">Contact</Link>
                {/* <button className=" w-12 h-12 bg-red-400 rounded-full border-4 border-red-100 hover:border-red-600"></button> */}
            </div>

        </div>

    </nav>
  )
}
