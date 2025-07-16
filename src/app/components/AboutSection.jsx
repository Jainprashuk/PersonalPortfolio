"use client";
import React, { useTransition, useState } from "react";
import Image from "next/image";
import TabButton from "./TabButton";

const TAB_DATA = [
  {
    title: "Skills",
    id: "skills",
    content: (
      <ul className="list-disc pl-2">
        <li>Data Structures & Algorithm</li>
        <li>Languages : Cpp(Primary) , javascript , python & C</li>
        <li>HTML , CSS , Javascript & Typescript</li>
        <li>React(Primary) , NextJs & Angular</li>
        <li>Tailwind & Bootstrap</li>
        <li>NodeJs , Express & MongoDb</li>
        <li>Graphic Design : Adobe Photoshop , Figma & Canva</li>
        <li>Git & GitHub</li>
      </ul>
    ),
  },
  {
    title: "Education",
    id: "education",
    content: (
      <ul className="list-disc pl-2">
        <li>BTECH-CSE - LPU  ( 8.00 CGPA )</li>
        <li>XII - CBSE ( 78% )</li>
        <li>X - CBSE ( 79% )</li>
      </ul>
    ),
  },
  {
    title: "Certifications",
    id: "certifications",
    content: (
      <ul className="list-disc pl-2">
        <li>Full Stack Development with React & Node JS - Live</li>
        <li>Learn C++ Programming -Beginner to Advance- DeepDive in C++</li>
        <li>Git & GitHub Master Course (2022)</li>
        <li>IEEE Membership certificate</li>
        <li>Divide and Conquer, Sorting and Searching, and Randomized Algorithms</li>
        <li>Crash Course on Python</li>
        <li>Learn Python Programming Masterclass</li>
      </ul>
    ),
  },
  {
    title: "Experience",
    id: "Experience",
    content: (
      <ul className="list-disc pl-2">
        <li>Software Engineer at StrideOne - current </li>
        <li>FrontEnd - Intern at StrideOne</li>
        <li>Chegg Subject Matter Expert</li>
        <li>Web-Lead IEEE CIS LPU</li>
        <li>Campus Superhero - coding Blocks</li>
      </ul>
    ),
  },
];

const AboutSection = () => {
  const [tab, setTab] = useState("skills");
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (id) => {
    startTransition(() => {
      setTab(id);
    });
  };

  return (
    <section className="text-white" id="about">
      <div className="md:grid md:grid-cols-2 gap-8 items-center py-8 px-4 xl:gap-16 sm:py-16 xl:px-16">
        <Image src="/images/myphoto.jpg" width={500} height={500} alt="Hey I am Prashuk jain , Welcome to JainPrashuk homepage. Discover more about my journey in engineering and development. i am Third-year engineering student at Lovely Professional University in Punjab, passionate about becoming a full-stack developer. Eager to learn, apply skills to real projects, and a strong team player. currently a chegg expert , ex- web lead ieee cis lpu , upcoming sde" />
        <div className="mt-4 md:mt-0 text-left flex flex-col h-full">
          <h2 className="text-4xl font-bold text-white mb-4 dark:text-gray-900">About Me</h2>
          <p className="text-base lg:text-lg dark:text-gray-900">
          Crafting seamless digital experiences is what drives me. As a Software Engineer, currently a <u>Software Engineer</u>  at <u>StrideOne</u>, I bring ideas to life using the <u>MERN stack</u> - React, Node.js, Express, and MongoDB. My passion lies in solving complex challenges, from database optimization to creating interactive user interfaces. </p>
          <br />
          <p className="text-base lg:text-lg dark:text-gray-900">
          My Computer Science education At Lovely Professional University has equipped me with a strong foundation in algorithms, data structures, and full-stack development, which I apply to real-world projects. Specializing in MERN and experienced with frameworks like React and Angular, I’m skilled at building scalable applications. Through hands-on projects and internships, I have enhanced my collaborative and technical capabilities to create impactful, user-centered solutions.</p>
          <div className="flex flex-row justify-start mt-8">
            <TabButton
              selectTab={() => handleTabChange("skills")}
              active={tab === "skills"}
            >
              {" "}
              Skills{" "}
            </TabButton>
            <TabButton
              selectTab={() => handleTabChange("education")}
              active={tab === "education"}
            >
              {" "}
              Education{" "}
            </TabButton>
            {/* <TabButton
              selectTab={() => handleTabChange("certifications")}
              active={tab === "certifications"}
            >
              {" "}
              Certifications{" "}
            </TabButton> */}
            <TabButton
              selectTab={() => handleTabChange("Experience")}
              active={tab === "Experience"}
            >
              {" "}
              Experience{" "}
            </TabButton>
          </div>
          <div className="mt-8 dark:text-gray-900">
            {TAB_DATA.find((t) => t.id === tab).content}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;








