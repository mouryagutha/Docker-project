import React from 'react';
import Sidebar from '../components/Sidebar';
// import LogView from '../components/LogView';

const Logs = () => {
  return (
    <div className="w-full flex">
      <div className="top-0 left-0 w-[18%]">
        <Sidebar />
      </div>
      <div className="w-full flex flex-col items-center p-8">
        <h1 className="text-2xl font-semibold p-4">Logs</h1>
        {/* <LogView /> */}
      </div>
    </div>
  )
}

export default Logs