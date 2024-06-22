import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Speedometer from '../components/utilisation/Speedometer';
import CPUutil from '../components/utilisation/CPUutil';
import Memoryutil from '../components/utilisation/Memoryutil';
import { PieChart } from '@mui/x-charts/PieChart';
import TestLine from '../components/TestLine';
import axios from 'axios';
import LineChart from '../components/Plotline';

const Home = () => {
  const [machineInfo, setMachineInfo] = useState({});
  const [dockerInfo, setDockerInfo] = useState({});
  const [containerInfo, setContainerInfo] = useState({});

  useEffect(() => {
    axios.get('http://localhost:3000/dockerInfo')
      .then((response) => {
        setDockerInfo(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(dockerInfo);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get('http://localhost:3000/machineInfo')
        .then((response) => {
          setMachineInfo(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3000/allContainers')
      .then((response) => {
        setContainerInfo(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  console.log(containerInfo);

  return (
    <>
      <div className="w-full flex">
        <div className="top-0 left-0 w-[18%]">
          <Sidebar />
        </div>
        <div className="w-full flex flex-col p-10 items-center">
          <h1 className="text-xl text-start w-full pb-12">Hi There,</h1>
          <div className="flex w-full gap-3">
            <CPUutil cpuUsage={machineInfo} />
            <Memoryutil totalRam={machineInfo.ram} freeRam={machineInfo.freeRam} />
            <Speedometer cpuSpeed={machineInfo.cpu && machineInfo.cpu[0].speed} />
            <div className="w-1/4 flex flex-col border border-zinc-600 bg-zinc-800 rounded-xl p-2 gap-4 items-start justify-center ">
              <h1 className="text-xl px-4 py-1">Insights</h1>
              <div className="w-full bg-zinc-300 rounded-lg text-zinc-800 py-1 px-3 font-semibold">Total Containers: {dockerInfo.Containers}</div>
              <div className="w-full bg-zinc-300 rounded-lg text-zinc-800 py-1 px-3 font-semibold">Running: {dockerInfo.ContainersRunning}</div>
              <div className="w-full bg-zinc-300 rounded-lg text-zinc-800 py-1 px-3 font-semibold">Stopped: {dockerInfo.ContainersStopped}</div>
              <div className="w-full bg-zinc-300 rounded-lg text-zinc-800 py-1 px-3 font-semibold">Images: {dockerInfo.Images}</div>
            </div>
          </div>


          <div className="w-full flex gap-5 items-center py-8">
            <div className="w-1/4 rounded-2xl border p-8 flex flex-col gap-3 bg-zinc-800 border-zinc-700">
              <h1 className="text-xl px-4 py-1">Past Containers</h1>
              {containerInfo.exitedContainers && containerInfo.exitedContainers.slice(0, 6).map((container, index) => (
                <div key={index} className="w-full flex items-center justify-between bg-zinc-300 rounded-lg text-zinc-800 py-1 px-3">
                  <h1 className='font-semibold'>{container.Names} - {container.Image}</h1>
                  <h1 className='text-md'>{container.RunningFor}</h1>
                </div>
              ))}
            </div>
            <div className="w-3/4 rounded-2xl border border-zinc-800 bg-zinc-300">
              <LineChart />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
