import { ClassNames } from "@emotion/react";
import React, { useState } from "react";
import Router from "next/router";


interface LevelProps {
    level: number;
    per : number;
}
interface StatsProps{
    per: number;
    name : string;
}


export default class LevelStatics extends React.Component<LevelProps> {
    render(){
        const { level, per } = this.props
        return (
            <div className='flex flex-row md:flex-col items-center gap-8 md:gap-4 lg:gap-7'>
            <div className="radial-progress bg-primary text-primary-content border-4 border-primary  md:w-40 md:h-40"
             style={{"--value":per}}>{per}%</div>
            <p className=" font-mono font-semibold border-b-4 border-cyan-300">
              Level :
              <span className=" text-lg font-extrabold text-cyan-500 pl-2">
                { level}

              </span>
            </p>

        </div>
        );
    }
}


export class Stats extends React.Component<StatsProps> {
    render(){
        const { per, name } = this.props
        return (
            <div className='flex flex-row md:flex-col items-center gap-8 md:gap-4 lg:gap-7'>
            <div className="radial-progress bg-primary text-primary-content border-4 border-primary  md:w-40 md:h-40"
             style={{"--value":per}}>{per}%</div>
            <p className=" font-mono font-semibold border-b-4 border-cyan-300">
                {name}
            </p>
           

        </div>
        );
    }
}




