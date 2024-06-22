import React from 'react';
import ReactSpeedometer from "react-d3-speedometer";
import { FiCpu } from "react-icons/fi";

const CPUutil = (props) => {
    const { cpu } = props;
    let totalUsage = 0;
    
    cpu && cpu.forEach(core => {
        const coreUsage = Object.values(core.times).reduce((acc, time) => acc + time, 0);
        totalUsage += coreUsage;
    });

    const totalCores = cpu && cpu.length;
    const averageUsage = totalUsage / totalCores;

    return (
        <>
            <div className="w-1/4 p-8 flex flex-col items-center bg-zinc-800 rounded-2xl border relative border-zinc-600 shadow-xl">
                <FiCpu className='absolute top-3 left-3 text-3xl border border-zinc-500 p-1 rounded-md'/>
                <ReactSpeedometer
                    maxValue={100}
                    value={averageUsage}
                    needleColor="steelblue"
                    startColor="green"
                    maxSegmentLabels={5}
                    segments={5555}
                    endColor="red"
                    width={250}
                    height={180}
                />
                <h1 className='text-lg font-semibold'>{averageUsage.toFixed(2)}</h1>
                <h1 className='text-lg'>CPU Utilization</h1>
            </div>
        </>
    )
}

export default CPUutil;
