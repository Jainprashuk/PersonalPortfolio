"use client";
import Link from "next/link";
import React, { useState } from "react";
// import NavLink from "./NavLink";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
// import MenuOverlay from "./MenuOverlay";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { TypeAnimation } from "react-type-animation";

const navLinks = [
  {
    title: "About",
    path: "#about",
  },
  {
    title: "Projects",
    path: "#projects",
  },
  {
    title: "Certificates",
    path: "#certificates",
  },
  {
    title: "Contact Me",
    path: "#contact",
  },
];

const Navbar = () => {
  const router = useRouter()

  const handlelogout = ()=>{
    router.push('/')
    toast.success("Logged Out Sucess")

  }

  

  return (
    <nav className="mx-auto border border-[#33353F]  bg-gray-100 bg-opacity-100">
      <div className="flex container lg:py-4 flex-wrap items-center justify-between mx-auto px-4 py-2">
        <div className="flex justify-center items-center text-gray-100">
          

          <Link
            href={"/"}
            className="text-2xl md:text-5xl text-white font-semibold"
          >
            <img
              src="/images/header.png"
              width={48}
              alt="Hey I am Prashuk jain , Welcome to JainPrashuk homepage. Discover more about my journey in engineering and development. i am Third-year engineering student at Lovely Professional University in Punjab, passionate about becoming a full-stack developer. Eager to learn, apply skills to real projects, and a strong team player. currently a chegg expert , ex- web lead ieee cis lpu , upcoming sde"
            />
          </Link>

          <TypeAnimation
            sequence={[
              "Eat 🍽️",
              1000,
              "Code 💻",
              1000,
              "Sleep 😴",
              1000,
              "Repeat 🔁",
              1000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            style={{ color: "black" }}
          />
        </div>

        <div onClick={()=>handlelogout()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              class="bi bi-box-arrow-left"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"
              />
              <path
                fill-rule="evenodd"
                d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"
              />
            </svg>
          </div>

        
      </div>
    </nav>
  );
};

export default Navbar;
