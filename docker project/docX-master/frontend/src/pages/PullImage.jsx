import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const PullImage = () => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    const pullImage = async (imageName) => {
        try {
            const promise = axios.post('http://localhost:3000/pullImage', { imagename: imageName });
            toast.promise(
                promise,
                {
                    loading: 'Pulling image...',
                    success: 'Image pulled successfully',
                    error: 'Failed to pull image',
                },
                {
                    success: {
                        duration: 2000,
                    },
                }
            );
            const response = await promise;
            if (response.status === 200) {
                navigate('/images');
            }
        } catch (error) {
            console.error('Error pulling image:', error);
        }
    };

    return (
        <>
            <div className="w-full flex">
                <div className="top-0 left-0 w-[18%]">
                    <Sidebar />
                </div>
                <div className="w-full flex flex-col items-center p-8">
                    <h1 className="text-2xl font-semibold p-4">Pull Images</h1>
                    <p className='text-center py-6'>
                        Pull images directly from Docker Hub to use them in your projects.
                    </p>
                    <div className="w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Enter image name..."
                            value={searchKeyword}
                            onChange={handleSearchChange}
                            className="w-full border rounded-md py-2 px-3 text-black focus:outline-none focus:ring focus:border-blue-300"
                        />
                        <button
                            onClick={() => pullImage(searchKeyword)}
                            className="mt-2 px-4 py-2 bg-zinc-300 text-black w-full rounded-md hover:scale-105 transition-all focus:outline-none"
                        >
                            Pull
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PullImage;
