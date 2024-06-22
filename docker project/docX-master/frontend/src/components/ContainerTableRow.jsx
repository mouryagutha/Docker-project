import React, { useState } from 'react';
import { GoContainer } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { FaPlay } from "react-icons/fa";
import { FaStop } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const ContainerTableRow = (props) => {
    const { container } = props;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
        navigate(`/containers/${container.ID}`);
    };

    const getTimeDifference = (timestamp) => {
        const currentTime = new Date();
        const postTime = new Date(timestamp);
        const difference = currentTime - postTime;
        const seconds = Math.floor(difference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);

        if (months > 0) {
            return `${months} months ago`;
        } else if (days > 0) {
            return `${days} days ago`;
        } else if (hours > 0) {
            return `${hours} hours ago`;
        } else if (minutes > 0) {
            return `${minutes} minutes ago`;
        } else {
            return `${seconds} seconds ago`;
        }
    };

    const startContainer = async (id) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/start/${id}/`);
            if (response.status === 200) {
                console.log('Container started successfully');
                toast.success('Container started successfully');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                console.error('Failed to start container');
                toast.error('Failed to start container');
            }
        } catch (error) {
            console.error('Failed to start container:', error);
            toast.error('Failed to start container');
        } finally {
            setIsLoading(false);
        }
    };

    const stopContainer = async (id) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/stop/${id}/`);
            if (response.status === 200) {
                console.log('Container stopped successfully');
                toast.success('Container stopped successfully');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                console.error('Failed to stop container');
                toast.error('Failed to stop container');
            }
        } catch (error) {
            console.error('Failed to stop container:', error);
            toast.error('Failed to stop container');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteContainer = async (id) => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`http://localhost:3000/Rmcontainers/${id}`);
            if (response.status === 200) {
                console.log('Container deleted successfully');
                toast.success('Container deleted successfully');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                console.error('Failed to delete container');
                toast.error('Failed to delete container');
            }
        } catch (error) {
            console.error('Failed to delete container:', error);
            toast.error('Failed to delete container');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <tr className='hover:bg-zinc-700/50 transition-all cursor-pointer'>
            <td className="px-12 py-4 flex items-center gap-2 text-sm font-medium text-gray-300 whitespace-nowrap" onClick={handleClick}>
                <GoContainer className='text-blue-500' />
                {container.ID && container.ID.slice(0, 12)}
            </td>
            <td className="px-8 py-4 text-sm font-medium text-gray-300 whitespace-nowrap">
                {container.Image}
            </td>
            <td className="px-12 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{container.Command}</td>
            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                {container.Created && getTimeDifference(container.Created)}
                {container.RunningFor && container.RunningFor}
            </td>
            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                {container.State === 'running' ? 'Running' : 'Exited'}
            </td>
            <td className="px-8 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{container.Names}</td>
            <td className="pl-4 py-4 text-sm whitespace-nowrap">
                <div className="flex items-center gap-x-2">
                    {isLoading ? (
                        <p className="px-3 py-1 text-xs text-yellow-100 rounded-full bg-yellow-600/80">Loading...</p>
                    ) : (
                        <>
                            {container.State === 'running' ? (
                                <p className="px-3 py-1 text-md text-red-100 rounded-full bg-red-600/80 flex items-center gap-1" onClick={() => stopContainer(container.ID)}><FaStop className='text-xs'/> Stop</p>
                            ) : (
                                <p className="px-3 py-1 text-md text-green-100 rounded-xl hover:scale-105 transition-all bg-green-600/80 flex items-center gap-1" onClick={() => startContainer(container.ID)}><FaPlay className='text-xs'/>Run</p>
                            )}
                            <p className="text-xl text-white mx-2 rounded-full flex items-center gap-1" onClick={() => deleteContainer(container.ID)}><MdDelete className=''/></p>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default ContainerTableRow;
