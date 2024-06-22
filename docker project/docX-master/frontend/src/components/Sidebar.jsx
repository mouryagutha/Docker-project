import React, { useState } from 'react';
import axios from 'axios';
import { FiHome } from "react-icons/fi";
import { useLocation } from 'react-router-dom';
import { FaAngleRight } from "react-icons/fa6";
import { GoContainer } from "react-icons/go";
import { HiMiniCubeTransparent } from "react-icons/hi2";
import { IoBuildOutline } from "react-icons/io5";
import { FaDocker } from "react-icons/fa";
import { IoChatbubbleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { FaClipboardList } from "react-icons/fa6";
import {toast} from 'sonner';

const Sidebar = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [error, setError] = useState('');

    const OpenModal = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleChange = (event) => {
        setInputValue(event.target.value);
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleChatbotSubmit();
        }
    }

    const handleChatbotSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:3000/chatbot', { prompt: inputValue });
            setResponseMessage(response.data.message);
            setShowModal(false);
            setError('');
            // Check if the response message matches a particular command
            if (response.data.message === 'YourCommand') {
                // Show a toast notification
                toast.success('Your command executed successfully!');
            }
        } catch (error) {
            setResponseMessage('');
            setError(error.response.data.error);
            // Show a toast notification for errors
            toast.error('An error occurred while processing your command.');
        }
    }
    return (
        <>
        <div className="flex fixed z-10 top-0 left-0 flex-col w-64 h-screen px-5 py-8 overflow-y-auto bg-zinc-400/10 backdrop-blur-lg border-r rtl:border-r-0 rtl:border-l border-zinc-700 ">
            <a href="#">
                <h1 className='text-2xl flex items-center gap-2 font-semibold px-8'>
                    <FaDocker className='text-blue-500 text-5xl' />
                    DocX
                </h1>
            </a>

            <div className="flex flex-col justify-between flex-1 mt-6">
                <nav className="-mx-3 space-y-3 ">
                    <a className={`flex items-center px-3 py-2 text-gray-300 transition-colors duration-300 transform rounded-lg hover:bg-gray-300 hover:text-gray-800 ${location.pathname === '/' ? 'bg-zinc-300 text-zinc-800' : ''}`} href="/">
                        <FiHome />
                        <span className="mx-2 text-sm font-medium">Dashboard</span>
                    </a>
                    <a className={`flex items-center px-3 py-2 text-gray-300 transition-colors duration-300 transform rounded-lg hover:bg-gray-300 hover:text-gray-800 ${location.pathname === '/images' ? 'bg-zinc-300 text-zinc-800' : ''}`} href="/images">
                        <HiMiniCubeTransparent />
                        <span className="mx-2 text-sm font-medium">Images</span>
                    </a>
                    <a className={`flex items-center px-3 py-2 text-gray-300 transition-colors duration-300 transform rounded-lg hover:bg-gray-300 hover:text-gray-800 ${location.pathname === '/containers' ? 'bg-zinc-300 text-zinc-800' : ''}`} href="/containers">
                        <GoContainer />
                        <span className="mx-2 text-sm font-medium">Containers</span>
                    </a>
                    <a className={`flex items-center px-3 py-2 text-gray-300 transition-colors duration-300 transform rounded-lg hover:bg-gray-300 hover:text-gray-800 ${location.pathname === '/pull' ? 'bg-zinc-300 text-zinc-800' : ''}`} href="/pull">
                        <IoBuildOutline />
                        <span className="mx-2 text-sm font-medium">Pull Image</span>
                    </a>
                    {/* <a className={`flex items-center px-3 py-2 text-gray-300 transition-colors duration-300 transform rounded-lg hover:bg-gray-300 hover:text-gray-800 ${location.pathname === '/logs' ? 'bg-zinc-300 text-zinc-800' : ''}`} href="/logs">
                        <FaClipboardList />
                        <span className="mx-2 text-sm font-medium">Logs</span>
                    </a> */}
                    <a className={`flex items-center px-3 py-2 text-gray-300 transition-colors duration-300 transform rounded-lg hover:bg-gray-300 hover:text-gray-800 ${location.pathname === '/chat' ? 'bg-zinc-300 text-zinc-800' : ''}`} href="/chat">
                        <IoChatbubbleOutline />
                        <span className="mx-2 text-sm font-medium">Chat</span>
                    </a>
                </nav>


                <div>
                    <div className="flex items-center justify-between cursor-pointer hover:bg-zinc-700 px-2 py-2 rounded-lg" onClick={OpenModal}>
                        <h2 className="text-base font-semibold text-gray-800 dark:text-white">Ask DocX !</h2>
                        <button className="p-0.5 hover:bg-gray-100 duration-200 transition-colors text-gray-200  border rounded-lg">
                            <FaAngleRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
        { showModal && (
                <div className="fixed inset-0 bg-black    bg-opacity-50 flex z-[9999] items-center justify-center">
                    <div className="bg-white/30 backdrop-blur-2xl p-8 rounded-lg w-[50%] flex   items-center justify-center flex-col ">
                        <h1 className="text-2xl  text-black font-semibold">Ask DocX</h1>
                        <input 
                            type="text" 
                            value={inputValue} 
                            onChange={handleChange} 
                            onKeyPress={handleKeyPress} 
                            placeholder='Enter your question' 
                            className="outline-none w-full bg-gray-200 text-black mt-4 p-3 text-xl border rounded-lg" 
                        />
                        <button className="w-full mt-4 bg-red-500/60 backdrop-blur-2x text-white p-2 rounded-lg" onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}
    </>
    );
};

export default Sidebar;
