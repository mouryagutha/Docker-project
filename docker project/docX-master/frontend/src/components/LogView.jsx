import React from 'react';

const LogView = ({ logs }) => {
  return (
    <div className="max-w-lg mx-auto mt-8">
      <h1 className="text-xl font-bold mb-4">Log Viewer</h1>
      <ul className="divide-y divide-gray-200">
        {logs.map((log, index) => (
          <li key={index} className="py-4">
            <div className="flex space-x-3">
              <div className="flex-1">
                <p className="text-gray-900 text-sm font-medium">{log.timestamp}</p>
                <p className="text-gray-500 text-sm">{log.message}</p>
                <p className="text-gray-500 text-sm">Level: {log.level}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LogView;
