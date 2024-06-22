import React from 'react';
import ReactSpeedometer from "react-d3-speedometer";
import { FaMemory } from "react-icons/fa6";


const Memoryutil = (props) => {
    const { totalRam, freeRam } = props;
    const usedRam = totalRam - freeRam;
    const memoryUsage = ((usedRam / totalRam) * 100)?.toFixed(2);
    // console.log(memoryUsage)
    return (
        <>
            <div className="w-1/4 p-8 flex flex-col items-center relative bg-zinc-800 rounded-2xl border border-zinc-600 shadow-xl">
            <FaMemory className='absolute top-3 left-3 text-3xl border border-zinc-500 p-1 rounded-md'/>
                <ReactSpeedometer
                    maxValue={100}
                    value={memoryUsage}
                    needleColor="steelblue"
                    startColor="green"
                    maxSegmentLabels={5}
                    segments={5555}
                    endColor="red"
                    width={250}
                    height={180}
                />
                <h1 className='text-lg font-semibold'>{memoryUsage}</h1>
                <h1 className='text-lg'>Memory Utilization</h1>
            </div>
        </>
    )
}

export default Memoryutil;