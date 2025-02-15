"use client";
import Link from "next/link";
import React, { useState } from "react";
import NavLink from "./NavLink";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import MenuOverlay from "./MenuOverlay";
import ThemeToogler from "./ThemeToogler";

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
  {
    title: "Visitors Analytics",
    path: "/Insights",
  },
  {
    title: "Admin",
    path: "/Admin/response",
  }
];

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <nav className="dark:bg-white fixed mx-auto border border-[#33353F] dark:border-gray-100 top-0 left-0 right-0 z-10 bg-[#121212] bg-opacity-100">
      <div className="flex container lg:py-4 flex-wrap items-center justify-between mx-auto px-4 py-2">
        <div className="flex justify-center items-center text-gray-100 dark:text-gray-900">
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
          />
        </div>

        <div className="mobile-menu flex justify-center items-center block md:hidden gap-8">
        <ThemeToogler/>
          {!navbarOpen ? (
            <>
            
            <button
              onClick={() => setNavbarOpen(true)}
              className="flex items-center px-3 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white dark:text-gray-900 dark:border-gray-900"
            >
              <Bars3Icon className="h-5 w-5" />
            </button></>
          ) : (
            <>
            
            <button
              onClick={() => setNavbarOpen(false)}
              className="flex items-center px-3 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white dark:text-gray-900 dark:border-gray-900"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            </>
          )}
        </div>
        <div className="menu hidden md:block md:w-auto" id="navbar">
          <ul className="flex p-4 md:p-0 md:flex-row md:space-x-8 mt-0">
            {navLinks.map((link, index) => (
              <li key={index}>
                <NavLink href={link.path} title={link.title} />
              </li>
            ))}
            <li>
              <ThemeToogler />
            </li>
          </ul>
        </div>
      </div>
      {navbarOpen ?  <>  <MenuOverlay links={navLinks} /></> : null}
    </nav>
  );
};

export default Navbar;
