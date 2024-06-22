import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

const ImageTableRow = (props) => {
  const { image } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [tag, setTag] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleTagChange = (e) => {
    setTag(e.target.value);
  };

  const pushImage = async (imagename) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/push",
        { imageName: imagename, username: name, password: password, tag: tag }
      );
      if (response.status === 200) {
        console.log("Image pushed successfully");
        toast.success("Image pushed successfully");
        closeModal();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.error("Failed to push image");
        toast.error("Failed to push image");
      }
    } catch (error) {
      console.error("Failed to push image:", error);
      toast.error("Failed to push image");
    } finally {
      setIsLoading(false);
    }
  };

  const startContainer = async (imagename) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/createContainer",
        { imagename: imagename }
      );
      if (response.status === 200) {
        console.log("Container started successfully");
        toast.success("Container started successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.error("Failed to start container");
        toast.error("Failed to start container");
      }
    } catch (error) {
      console.error("Failed to start container:", error);
      toast.error("Failed to start container");
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeDifference = (date) => {
    const currentDate = new Date();
    const createdDate = new Date(date);
    const diff = currentDate - createdDate;
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    return `${Math.floor(diffInDays)} days ago`;
  };


  return (
    <tr>
      <td className="px-12 py-4 text-sm font-medium text-gray-300 whitespace-nowrap">
        {extractTrepoName(image?.repoTags[0])}
      </td>
      <td className="px-12 py-4 text-sm font-medium text-gray-300 whitespace-nowrap">
        {extractTagName(image?.repoTags[0])}
      </td>
      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
        {image && image.id}
      </td>
      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
        {image && (image.size / (1024 * 1024)).toFixed(3)} MB
      </td>
      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
        {image.created && getTimeDifference(image.created)}
      </td>
      <td className="pl-4 py-4 text-sm whitespace-nowrap">
        <div className="flex items-center gap-x-2">
          <button
            onClick={() => startContainer(extractTrepoName(image.repoTags[0]))}
            disabled={isLoading}
            className="px-3 py-1 text-xs text-green-100 rounded-full bg-green-600/80"
          >
            {isLoading ? "Starting..." : "Run"}
          </button>
          <button
            onClick={openModal}
            className="px-3 py-1 text-xs text-red-100 rounded-full bg-blue-600/80"
          >
            Push
          </button>
        </div>
      </td>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-black opacity-75"></div>
            </div>

            <div className="bg-white z-50 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-lg text-zinc-900 font-semibold mb-4">Push Image</h2>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleNameChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-black py-2 text-2xl px-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="text"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full border-gray-300 rounded-md text-black py-2 text-2xl px-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="tag" className="block text-sm font-medium text-gray-700">
                  Tag
                </label>
                <input
                  type="text"
                  id="tag"
                  name="tag"
                  value={tag}
                  onChange={handleTagChange}
                  className="mt-1 block w-full border-gray-300 rounded-md text-black py-2 text-2xl px-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border-transparent text-sm font-medium rounded-md text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => pushImage(extractTrepoName(image.repoTags[0]))}
                  className="ml-3 px-4 py-2 border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Push Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </tr>
  );
};

const extractTagName = (repoTag) => {
  const tagParts = repoTag && repoTag.split(":");
  return tagParts && tagParts.length > 1 ? tagParts[1] : repoTag;
};

const extractTrepoName = (repoTag) => {
  const tagParts = repoTag && repoTag.split(":");
  return tagParts && tagParts.length > 0 ? tagParts[0] : repoTag;
};

export default ImageTableRow;
