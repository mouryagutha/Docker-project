import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useParams } from 'react-router-dom';
import { GoContainer } from "react-icons/go";
import axios from 'axios';
import CPUutil from '../components/utilisation/CPUutil';
import Guageutil from '../components/utilisation/Guageutil';

const ContainerDetail = () => {
    const [container, setContainer] = useState({});
    const { id } = useParams();

    useEffect(() => {
        const fetchContainer = async () => {
            try {
                const { data } = await axios.get(`http://localhost:3000/stats/${id}`);
                setContainer(data);
            } catch (error) {
                console.error('Error fetching container data:', error);
            }
        }
        fetchContainer();
    }, [id]);

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getMaxCpuUsagePercentage = () => {
        if (!container.cpu_stats || !container.cpu_stats.cpu_usage || !container.cpu_stats.system_cpu_usage || !container.cpu_stats.online_cpus) {
            return 0;
        }
        const totalUsage = container.cpu_stats.cpu_usage.total_usage;
        const systemUsage = container.cpu_stats.system_cpu_usage;
        const onlineCpus = container.cpu_stats.online_cpus;
        return ((totalUsage / systemUsage) * onlineCpus * 100).toFixed(2);
    };

    return (
        <div className="flex w-full h-screen">
            <div className="top-0 left-0 w-[18%]">
                <Sidebar />
            </div>
            <div className="w-full flex flex-col flex-grow p-8 overflow-y-auto">
                <div className="flex items-center gap-4">
                    <GoContainer className="text-xl" />
                    <h1 className="text-2xl font-semibold">Container Details</h1>
                    <p className="text-gray-500">ID: {id}</p>
                </div>

                <div className="flex w-full py-4">
                    <h1 className="text-xl font-semibold">Name: {container.name}</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                    <div className="bg-white rounded-md shadow-md p-6">
                        <h2 className="text-xl text-zinc-800 font-semibold mb-4">CPU Usage</h2>
                        <p className='text-zinc-800'>Total CPU Usage: {container.cpu_stats && container.cpu_stats.cpu_usage && container.cpu_stats.cpu_usage.total_usage}</p>
                        {/* <p>Total CPU Utilization: {getMaxCpuUsagePercentage()}%</p> */}
                        <p className='text-zinc-800'>System CPU Usage: {container.cpu_stats && container.cpu_stats.system_cpu_usage}</p>
                        {/* <CPUutil cpuUsage={getMaxCpuUsagePercentage()} /> */}
                        <Guageutil cpuUsage={getMaxCpuUsagePercentage()} />
                    </div>

                    <div className="bg-white text-zinc-800 rounded-md shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Memory Usage</h2>
                        <p>Current Usage: {container.memory_stats && container.memory_stats.usage && formatBytes(container.memory_stats.usage)}</p>
                        <p>Max Usage: {container.memory_stats && container.memory_stats.max_usage && formatBytes(container.memory_stats.max_usage)}</p>
                    </div>

                    <div className="bg-white text-zinc-800 rounded-md shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Network</h2>
                        <p>Rx Bytes: {container.networks && container.networks.eth0 && container.networks.eth0.rx_bytes}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContainerDetail;
