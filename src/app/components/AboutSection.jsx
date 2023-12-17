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
        <li>Languages : Cpp(Primary) , javascript & C</li>
        <li>HTML , CSS & Javascript</li>
        <li>React(Primary) & Angular</li>
        <li>Tailwind & Bootstrap</li>
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
        <li>BTECH-CSE - LPU  ( 7.8 CGPA )</li>
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
        <Image src="/images/myphoto.jpg" width={500} height={500} />
        <div className="mt-4 md:mt-0 text-left flex flex-col h-full">
          <h2 className="text-4xl font-bold text-white mb-4">About Me</h2>
          <p className="text-base lg:text-lg">
          I am a Third-year engineering student at Lovely Professional University in Punjab, I am deeply passionate about pursuing a career as a full-stack developer. I am eager to absorb all the knowledge and skills I can in this dynamic field and apply them to real-world projects. In addition, I value teamwork and am highly sociable, making me a strong asset to any team.
          </p>
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
          <div className="mt-8">
            {TAB_DATA.find((t) => t.id === tab).content}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;








