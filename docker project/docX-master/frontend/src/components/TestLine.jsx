import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS } from "chart.js/auto";

const UserData = [
  {
    id: 1,
    year: 2016,
    pageViews: 100,
  },
  {
    id: 2,
    year: 2017,
    pageViews: 256,
  },
  {
    id: 3,
    year: 2018,
    pageViews: 188,
  },
  {
    id: 4,
    year: 2019,
    pageViews: 200,
  },
  {
    id: 5,
    year: 2020,
    pageViews: 143,
  },
  {
    id: 6,
    year: 2021,
    pageViews: 200,
  },
  {
    id: 7,
    year: 2022,
    pageViews: 250,
  },
  {
    id: 8,
    year: 2022,
    pageViews: 350,
  },
  {
    id: 9,
    year: 2022,
    pageViews: 450,
  },
];

const AnalyticsGraphCard = () => {
  const [userData, setUserData] = useState({
    labels: UserData.map((data) => data.year),
    datasets: [
      {
        label: 'Page Views',
        data: UserData.map((data) => data.pageViews),
        fill: false,
        borderColor: '#ec4899',
        pointRadius: 2,
      },
    ],
  });

  const options = {
    scales: {
      x: {
        grid: {
          display: true,
        },
        title: {
          display: false,
          text: 'Year',
        },
      },
      y: {
        grid: {
          display: true,
        },
        title: {
          display: false,
          text: 'Page Views',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
    },
  };


  return (
    <>
      <div className="w-full flex flex-col bg-zinc-800 rounded-2xl">
        {/* <h1 className="text-xl text-start w-full px-8 ">Analytics</h1> */}
        <div className="w-full h-full bg-[#212325] p-6 rounded-2xl">
          <Line data={userData} options={options} className='w-4/5'/>
          <h1 className="text-xl text-start w-full px-8 pt-2">I / O utilisation</h1>
        </div>

      </div>
    </>
  );
};

export default AnalyticsGraphCard;