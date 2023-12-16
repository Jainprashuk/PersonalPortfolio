"use client";
import React, { useState, useRef } from "react";
import ProjectCard from "./ProjectCard";
import ProjectTag from "./ProjectTag";
import { motion, useInView } from "framer-motion";

const projectsData = [
  {
    id: 1,
    title: "Personal Portfolio",
    description: "Personalized digital Website featuring work, skills, and personality for professional display and engagement",
    image: "/images/projects/portfolio.jpg",
    tag: ["All", "Web"],
    gitUrl: "/",
    previewUrl: "/",
  },
  {
    id: 2,
    title: "React Minds",
    description: "Crafted React documentation hub with a React compiler, quizzes, tutorials. Utilized HTML, CSS, Bootstrap, Angular for intuitive UI, robust functions. Centralized learning hub for React developers.",
    image: "/images/projects/reactminds.jpg",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/stars/Jainprashuk/lists/reactminds",
    previewUrl: "https://react-minds.vercel.app/",
  },
  {
    id: 3,
    title: "Code Leagalist",
    description: "Code Leagalist: A Smart India Hackathon project advancing to finals. Designed a digital assistant for legal awareness and a KYC framework in India.",
    image: "/images/projects/codeleagalist.jpg",
    tag: ["All", "Web"],
    gitUrl: "/",
    previewUrl: "https://code-legalist.vercel.app/",
  },
  {
    id: 4,
    title: "Js Minds",
    description: "JS Minds: Your Interactive Beginner's Guide to JavaScript with HTML, CSS, and JS. Learn through hands-on code examples, clear explanations, and useful references.",
    image: "/images/projects/jsminds.jpg",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/Jainprashuk/Js_Minds",
    previewUrl: "https://js-minds.vercel.app/",
  },
  {
    id: 5,
    title: "IEEE CIS LPU",
    description: "Developed a website for the IEEE CIS LPU chapter in my role as the web lead. The purpose of this website is to highlight information about the chapter and its various events.",
    image: "/images/projects/ieeecislpu.jpg",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/piyushdubey490/IEEE_CIS_LPU",
    previewUrl: "https://ieeecislpu.tech/",
  },
  {
    id: 6,
    title: "Dsa-Repo",
    description: "I've crafted a straightforward webpage for easy access to my GitHub repository, where you can find all my data structures and algorithms codes.",
    image: "/images/projects/dsa.jpg",
    tag: ["All", "others"],
    gitUrl: "https://github.com/Jainprashuk/Data-Structure-Algorithm",
    previewUrl: "https://dsa-webpage.vercel.app/",
  },
  {
    id: 7,
    title: "Parking Managment System",
    description: "Project 5 description",
    image: "/images/projects/6.png",
    tag: ["All", "others"],
    gitUrl: "/",
    previewUrl: "/",
  },
  {
    id: 8,
    title: "TimeMaster",
    description: "Project 5 description",
    image: "/images/projects/6.png",
    tag: ["All", "others"],
    gitUrl: "/",
    previewUrl: "/",
  },
];

const ProjectsSection = () => {
  const [tag, setTag] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const handleTagChange = (newTag) => {
    setTag(newTag);
  };

  const filteredProjects = projectsData.filter((project) =>
    project.tag.includes(tag)
  );

  const cardVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <section id="projects" className="mb-10">
      <h2 className="text-center text-4xl font-bold text-white mt-4 mb-8 md:mb-12">
        My Projects
      </h2>
      <div className="text-white flex flex-row justify-center items-center gap-2 py-6">
        <ProjectTag
          onClick={handleTagChange}
          name="All"
          isSelected={tag === "All"}
        />
        <ProjectTag
          onClick={handleTagChange}
          name="Web"
          isSelected={tag === "Web"}
        />
        <ProjectTag
          onClick={handleTagChange}
          name="others"
          isSelected={tag === "others"}
        />
      </div>
      <ul ref={ref} className="grid md:grid-cols-3 gap-8 md:gap-12">
        {filteredProjects.map((project, index) => (
          <motion.li
            key={index}
            variants={cardVariants}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            transition={{ duration: 0.3, delay: index * 0.4 }}
          >
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              imgUrl={project.image}
              gitUrl={project.gitUrl}
              previewUrl={project.previewUrl}
            />
          </motion.li>
        ))}
      </ul>
    </section>
  );
};

export default ProjectsSection;
