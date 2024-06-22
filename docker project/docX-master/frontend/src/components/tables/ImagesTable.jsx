import React, { useState, useEffect } from 'react';
import ImageTableRow from '../ImageTableRow';
import axios from 'axios';

const ImagesTable = () => {
  const [images, setImages] = useState([]);
  const [runningImages, setRunningImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/allImages');
        setImages(data);
      }
      catch (error) {
        console.error(error);
      }
    }
    fetchImages();
    // console.log(images);
  }, []);

  useEffect(() => {
    const fetchRunningContainers = async () => {
      try {
        const res = await axios.get('http://localhost:3000/dockerinfo');
        setRunningImages(res.data);
      }
      catch (error) {
        console.error(error);
      }
    }
    fetchRunningContainers();
    console.log(runningImages);
  } , []);

  return (
    <>
      <div className="container px-4 mx-auto">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-x-3">
            <h2 className="text-lg font-mediumtext-white">Total Images</h2>
            <span className="px-3 py-1 text-xs rounded-full bg-gray-800 text-blue-400">{runningImages.Images}</span>
          </div>
          <input type="text" className="w-72 px-3 py-2 text-sm text-gray-100 bg-gray-800 dark:bg-zinc-800 dark:border-gray-700 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" placeholder="Search Images " />
        </div>

        <div className="flex flex-col mt-6">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-zinc-200 dark:border-gray-700 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-zinc-700 ">
                    <tr>
                      <th scope="col" className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-100">Repository</th>
                      <th scope="col" className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-100">Tag</th>
                      <th scope="col" className="px-6 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-100">Image ID</th>
                      <th scope="col" className="px-6 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-100">Size</th>
                      <th scope="col" className="px-6 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-100">Created ago</th>
                      <th scope="col" className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-100">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:divide-zinc-700 dark:bg-zinc-800">

                    {images && images.map((image, index) => (
                      <ImageTableRow key={index} image={image} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>


      </div>
    </>
  )
}

export default ImagesTable