import React from "react";
import { CodeBracketIcon, EyeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import "./projectdescription.css";

const ProjectCard = ({
  imgUrl,
  title,
  description,
  gitUrl,
  previewUrl,
  aim,
  LongDescrption,
  TechStack,
  Learnings,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="border  border-2 border-[#ADB7BE] rounded-xl p-4 dark:border-gray-900 h-full">
      <div
        className="h-52 md:h-72 rounded-t-xl relative group"
        style={{
          background: `url(${imgUrl})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="overlay  items-center gap-2 justify-center absolute top-0 left-0 w-full h-full bg-[#181818] bg-opacity-0 hidden group-hover:flex group-hover:bg-opacity-80 transition-all duration-500 ">
          <Link
            href={gitUrl}
            className="h-14 w-14 mr-2 border-2 relative rounded-full border-[#ADB7BE] hover:border-white group/link"
          >
            <CodeBracketIcon className="h-10 w-10 text-[#ADB7BE] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  cursor-pointer group-hover/link:text-white" />
          </Link>
          <Link
            href={previewUrl}
            className="h-14 w-14 border-2 relative rounded-full border-[#ADB7BE] hover:border-white group/link"
          >
            <EyeIcon className="h-10 w-10 text-[#ADB7BE] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  cursor-pointer group-hover/link:text-white" />
          </Link>
          <button
            onClick={openModal}
            href={previewUrl}
            className="h-14 text-gray-100 w-14 border-2 relative rounded-full border-[#ADB7BE] hover:border-white group/link flex justify-center align-middle"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36px"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mx-auto my-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="text-white rounded-b-xl mt-3 bg-[#181818]py-6 px-4">
        <h5 className="text-xl font-semibold mb-2 dark:text-gray-900">
          {title}
        </h5>
        <p className="text-[#ADB7BE] dark:text-gray-900">{description}</p>
        {/* <button onClick={openModal}>click me</button> */}
      </div>
      {isModalOpen && (
  <div
    className="fixed inset-0 my-10 py-7 flex items-center justify-center  bg-opacity-50 z-50"
    onClick={closeModal}
  >
    <div
      className="dark:bg-white bg-gray-800 rounded-lg shadow-2xl max-w-3xl w-full md:max-w-7xl md:p-8 p-4 relative mx-2  max-h-full overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl md:text-3xl font-semibold focus:outline-none"
        onClick={closeModal}
      >
        &times;
      </button>

      <h1 className="text-center text-3xl md:text-5xl font-extrabold mb-6 text-gray-200 dark:text-gray-800">
        {title}
      </h1>

      <div className="text-gray-800 text-md md:text-lg border border-gray-200 p-4 md:p-6 rounded-lg mb-4 md:mb-6 bg-gray-900 dark:bg-gray-50">
        <h2 className="font-bold text-xl md:text-3xl mb-2 md:mb-3 text-gray-200 dark:text-indigo-700">Aim:</h2>
        <p className="dark:text-gray-900 text-gray-300">{aim}</p>
      </div>

      <div className="text-gray-800 text-md md:text-lg border border-gray-200 p-4 md:p-6 rounded-lg mb-4 md:mb-6 bg-gray-900 dark:bg-gray-50">
        <h2 className="font-bold text-xl md:text-3xl mb-2 md:mb-3 text-gray-200 dark:text-indigo-700">Description:</h2>
        <p className="dark:text-gray-900 text-gray-300">{LongDescrption}</p>
      </div>

      <div className="text-gray-800 text-md md:text-lg border border-gray-200 p-4 md:p-6 rounded-lg mb-4 md:mb-6 bg-gray-900 dark:bg-gray-50">
        <h2 className="font-bold text-xl md:text-3xl mb-2 md:mb-3 text-gray-200 dark:text-indigo-700">Tech Stack:</h2>
        <p className="dark:text-gray-900 text-gray-300">{TechStack}</p>
      </div>

      <div className="text-gray-800 text-md md:text-lg border border-gray-200 p-4 md:p-6 rounded-lg bg-gray-900 dark:bg-gray-50">
        <h2 className="font-bold text-xl md:text-3xl mb-2 md:mb-3 text-gray-200 dark:text-indigo-700">Learnings:</h2>
        <p className="dark:text-gray-900 text-gray-300">{Learnings}</p>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default ProjectCard;
