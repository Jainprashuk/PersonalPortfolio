"use client";
import React from "react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import Link from "next/link";
import "./sample.css";

const HeroSection = () => {
  return (
    <section className="lg:py-2">
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-8 place-self-center text-center sm:text-left justify-self-start"
        >
          <h1 className="text-white dark:text-gray-900 mb-4 text-4xl sm:text-5xl lg:text-6xl lg:leading-normal font-extrabold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600">
              Hello, I&apos;m{" "}
            </span>
            <br></br>
            <TypeAnimation
              sequence={[
                "Prashuk Jain",
                1000,
                "Mern Developer",
                1000,
                "Chegg Expert",
                1000,
                "React Developer",
                1000,
                "FrontEnd Developer",
                1000,
                "BackEnd Developer",
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </h1>
          <p className="text-responsive text-[#ADB7BE] text-wrap dark:text-gray-900 text-base sm:text-lg mb-6 lg:text-xl">
            Driven by innovation, Software Engineer, skilled in Full stack Development. Let&apos;s
            build smarter web experiences together!
          </p>
          <div>
            <Link
              href="/#contact"
              className="px-6 inline-block py-3 w-full sm:w-fit rounded-full mr-4 bg-gradient-to-br from-primary-500 to-secondary-500 hover:bg-slate-200 text-white"
            >
              Hire Me
            </Link>
            <Link
              href="https://drive.google.com/file/d/1JaM0EpW6hUeHe7eKHO_aBfZssZJs04aH/view"
              alt="Hey I am Prashuk jain , Welcome to JainPrashuk homepage. Discover more about my journey in engineering and development. i am Third-year engineering student at Lovely Professional University in Punjab, passionate about becoming a full-stack developer. Eager to learn, apply skills to real projects, and a strong team player. currently a chegg expert , ex- web lead ieee cis lpu , upcoming sde"
              target="_blank"
              className="px-1 inline-block py-1 w-full sm:w-fit rounded-full bg-pink-400 dark:bg-gray-400 dark:bg-gray-900  hover:bg-slate-800 text-white mt-3"
            >
              <span className="block bg-[#121212] dark:bg-gray-900 hover:bg-slate-800 rounded-full px-5 py-2 ">
                Download CV
              </span>
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-4 place-self-center mt-4 lg:mt-0"
        >
          <div className="rounded-full bg-[#181818] dark:bg-gray-200 w-[250px] h-[250px] lg:w-[350px] lg:h-[350px] md:w-[250px] md:h-[250px] relative">
            <Image
              src="/images/herosection.png"
              alt="Hey I am Prashuk jain , Welcome to JainPrashuk homepage. Discover more about my journey in engineering and development. i am Third-year engineering student at Lovely Professional University in Punjab, passionate about becoming a full-stack developer. Eager to learn, apply skills to real projects, and a strong team player. currently a chegg expert , ex- web lead ieee cis lpu , upcoming sde"
              className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              width={300}
              height={300}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
