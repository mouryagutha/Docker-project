import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Images from './pages/Images';
import Containers from './pages/Containers';
import ContainerDetail from './pages/ContainerDetail';
import PullImage from './pages/PullImage';
import { Toaster } from 'sonner'
import Chat from './pages/Chat';
import ChatBot from './components/ChatBot';

const App = () => {
  return (
    <>
      <div className="w-full flex">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<h1 className='h-screen w-full items-center justify-center flex text-2xl'>Not Found !</h1>} />
          <Route path="/images" element={<Images />} />
          <Route path="/containers" element={<Containers />} />
          <Route path="/containers/:id" element={<ContainerDetail />} />
          <Route path="/pull" element={<PullImage/>} />
          <Route path='/chat' element={<Chat />} />
          {/* <Route path='/logs' element={<LogViewer />} /> */}
          <Route path='/chatBot' element={<ChatBot />} />
        </Routes>
        <Toaster richColors position="top-center"/>
      </div>
    </>
  )
}

export default App