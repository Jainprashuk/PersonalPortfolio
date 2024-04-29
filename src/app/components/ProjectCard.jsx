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
    <div>
      <div
        className="h-52 md:h-72 rounded-t-xl relative group"
        style={{ background: `url(${imgUrl})`, backgroundSize: "cover" , backgroundRepeat:"no-repeat" }}
      >
        <div className="overlay items-center gap-2 justify-center absolute top-0 left-0 w-full h-full bg-[#181818] bg-opacity-0 hidden group-hover:flex group-hover:bg-opacity-80 transition-all duration-500 ">
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
            className="h-14 w-14 border-2 relative rounded-full border-[#ADB7BE] hover:border-white group/link flex justify-center align-middle"
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
        <h5 className="text-xl font-semibold mb-2">{title}</h5>
        <p className="text-[#ADB7BE]">{description}</p>
        {/* <button onClick={openModal}>click me</button> */}
      </div>
      {isModalOpen && (
        <div className="modal " onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close bg-white  p-2 my-auto " onClick={closeModal}>
              &times;
            </span>
            <h1 className=" text-center p-2 text-4xl  mb-5 rounded-mdm font-extrabold underline underline-offset-4 text-gray-900">{title}</h1>
            <p className="text-gray-900 text-center text-xl border-2 p-5 rounded-lg mb-5"><span className="text-gray-900 font-bold text-2xl">Aim: <br /> </span> {aim}</p>
            <p className="text-gray-900  text-xl border-2 p-5 rounded-lg mb-5">
              <p className="text-gray-900 font-bold text-center text-2xl  ">Description:  <br /> </p> {LongDescrption}
            </p>
            <p className="text-gray-900 text-center text-xl border-2 p-5 rounded-lg mb-5">
              <span className="text-gray-900 font-bold text-2xl">Tech Stack: <br /> </span> {TechStack}
            </p>
            <p className="text-gray-900  text-xl border-2 p-5 rounded-lg mb-5">
               <p className="text-gray-900 text-center font-bold text-2xl"> Learnings: <br /> </p>  {Learnings}
            </p>
            
            
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;


