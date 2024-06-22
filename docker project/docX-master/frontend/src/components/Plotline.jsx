import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const LineChart = () => {
  const [cpuData, setCpuData] = useState(Array.from({ length: 3 }, () => []));
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const fetchData = () => {
      try {
        // Simulate data for running containers
        const runningContainers = [
          { ID: "container1" },
          { ID: "container2" },
          { ID: "container3" },
          { ID: "container4" },
          { ID: "container5" },
          { ID: "container6" },
          { ID: "container7" },
          { ID: "container8" }
        ];

        // Generate random CPU usage for each container
        const randomCpuUsages = runningContainers.map(() => Math.floor(Math.random() * 100));

        // Update cpuData state with new CPU usage data
        setCpuData(prevData => [...prevData.slice(1), randomCpuUsages]);
        setTime(new Date());
      } catch (error) {
        console.error('Error fetching container data:', error);
      }
    };
  
    const interval = setInterval(fetchData, 1000);
  
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl mb-4 mt-4">Container CPU Usage Monitor</h1>
      <div className="w-full h-full max-w-4xl">
        <Plot
          className="w-full h-full"
          data={cpuData.map((cpuUsage, index) => ({
            type: 'scatter',
            x: Array.from({ length: cpuUsage.length }, (_, i) => new Date(time.getTime() - (7 - i) * 1000)),
            y: cpuUsage,
            mode: 'lines+markers',
            name: `Container ${index + 1}`,
            marker: { color: `hsl(${(index * 60) % 360}, 100%, 50%)` },
            line: { shape: 'spline' }
          }))}
          layout={{
            xaxis: { title: 'Time', tickformat: '%H:%M:%S', tickfont: { color: 'white' } },
            yaxis: { title: 'Usage (%)', range: [0, 100], tickfont: { color: 'white' } },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#fff' },
            margin: { t: 50, l: 50, r: 50, b: 50 },
          }}
        />
      </div>
    </div>
  );
};

export default LineChart;
