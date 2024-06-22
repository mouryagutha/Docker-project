import React from 'react';
import ReactSpeedometer from "react-d3-speedometer";
import { IoSpeedometer } from "react-icons/io5";


const Speedometer = (props) => {
    const { cpuSpeed } = props;
    // console.log(cpuSpeed)
    return (
        <>
            <div className="w-1/4 p-8 flex flex-col items-center relative bg-zinc-800 rounded-2xl border border-zinc-600 shadow-xl">
            <IoSpeedometer className='absolute top-3 left-3 text-3xl border border-zinc-500 p-1 rounded-md'/>
                <ReactSpeedometer
                    maxValue={100}
                    value={cpuSpeed}
                    needleColor="steelblue"
                    startColor="green"
                    maxSegmentLabels={5}
                    segments={5555}
                    endColor="red"
                    width={250}
                    height={180}
                />
                <h1 className='text-lg font-semibold'>{cpuSpeed}</h1>
                <h1 className='text-lg'>CPU Speed</h1>
            </div>
        </>
    )
}

export default Speedometer