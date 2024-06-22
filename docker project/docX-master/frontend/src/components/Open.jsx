// OpenDockerButton.jsx (or any component that contains the "Open Docker" button)
import axios from 'axios';
import React from 'react';

const OpenDockerButton = () => {
  const handleOpenDocker = async () => {
    try {
      const response = axios.post('http://localhost:3000/open-docker');
      if (response.ok) {
        console.log('Docker opened successfully');
      } else {
        console.error('Failed to open Docker');
      }
    } catch (error) {
      console.error('Error opening Docker:', error);
    }
  };

  return (
    <button onClick={handleOpenDocker}>Open Docker</button>
  );
};

export default OpenDockerButton;
