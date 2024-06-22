import * as React from 'react';
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from '@mui/x-charts/Gauge';

function GaugePointer() {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();

  if (valueAngle === null) {
    // No value to display
    return null;
  }

  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };
  return (
    <g>
      <circle cx={cx} cy={cy} r={7} fill="red" />
      <path
        d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
        stroke="red"
        strokeWidth={3}
      />
    </g>
  );
}

export default function Guageutil(props) {
  const { cpuUsage } = props;
  return (
    <div className="p-8 flex flex-col items-center bg-slate-200/90 rounded-2xl mt-4">

      <GaugeContainer
        width={200}
        height={200}
        startAngle={-110}
        endAngle={110}
        value={cpuUsage}
      >
        <GaugeReferenceArc />
        <GaugeValueArc />
        <GaugePointer />
      </GaugeContainer>
      <h1 className='text-lg text-black font-semibold'>{cpuUsage}</h1>
      <h1 className='text-lg text-black font-semibold'>CPU Utilization</h1>
    </div>
  );
}