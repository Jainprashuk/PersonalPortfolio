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
    aim:"The Aim Of personal portfolio website is to showcases skills and achievements to potential employers or clients, serving as a professional online identity for easy contact and strong first impressions. ",
    LongDescrption : " I have developed a personal portfolio website to showcase my presence in the field of computer science. This portfolio encapsulates not just who I am, but also the journey of the past two years. It marks the realization of a project that began in my first year of college—a basic HTML, CSS, and intermittent JavaScript portfolio. Since then, I have advanced through Tailwind CSS, delved deeper into JavaScript, and now embraced React and Next.js to enhance and elevate my portfolio's functionality and aesthetics. This website includes details of my achievements, experience, projects, certificates, and most importantly, the work I have accomplished during my college years.",
    TechStack : " HTML , CSS , JS , Tailwind , Next , Bootstarp , FontAwesome , HeroIcons ",
    Learnings : "Through this project, I've gained valuable insights into dynamic component creation, eliminating the need to replicate the same components repeatedly. Additionally, I've learned how to integrate data transmission from my website to Google Sheets, effectively utilizing Google Sheets as a REST API. These experiences have significantly enriched my understanding of web development and data management techniques."
  },
  {
    id: 2,
    title: "React Minds",
    description: "Crafted React documentation hub with a React compiler, quizzes, tutorials. Utilized HTML, CSS, Bootstrap, Angular for intuitive UI, robust functions. Centralized learning hub for React developers.",
    image: "/images/projects/react.png",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/stars/Jainprashuk/lists/reactminds",
    previewUrl: "https://react-minds.vercel.app/",
    aim:"The aim of creating the React Minds Documentation website is to make learning React easy, interactive, and exciting for all levels of developers and students. We provide comprehensive resources including tutorials, quizzes, and an online compiler to help users master React effectively. Let's code, learn, and elevate together!",
    LongDescrption : "Welcome to React Minds Documentation, your essential resource for mastering React! Whether you're a budding developer or a passionate student eager to delve into React, our comprehensive guide offers easy-to-follow insights, engaging quizzes, and a hands-on online compiler powered by CodeSandbox. Dive into a library of tutorial videos covering basic to advanced topics curated by experts. With our online compiler, experiment with real-time code execution and test your knowledge with interactive quizzes. We use HTML for structure, CSS for styling, JavaScript for interactivity, Tailwind CSS for streamlined design, and Bootstrap for responsive components. Join us on this exciting React journey at React Minds Documentation, where learning is accessible, interactive, and rewarding. Let's code, learn, and elevate together!",
    TechStack : "HTML , CSS , JS , Angular , BootStrap , NLP , CodeSandBox",
    Learnings : "Working on React Minds Documentation provides essential learnings in React development, covering fundamentals like components and state management, advanced techniques such as hooks and Redux, and practical skills like responsive design using Bootstrap and Tailwind CSS. You'll gain experience with CodeSandbox for real-time coding and testing, develop interactive quizzes, and improve collaboration skills with Git, enhancing your ability to create comprehensive documentation and tutorials for effective communication and teaching in React."
  },
  {
    id: 3,
    title: "Certificate Hub",
    description: "Certificate hub is designed as A Cutting-Edge Platform for Streamlined Certificate Storage.Integrated Auth0 for secure authentication and implemented user-specific schemas with distinct  databases ",
    image: "/images/projects/certificate.jpg",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/Jainprashuk/CertificateHub",
    previewUrl: "https://certificate-hub.vercel.app/",
    aim:"The aim of Certificate Hub is to provide a cutting-edge platform that streamlines certificate storage and management",
    LongDescrption : "Certificate Hub is an advanced platform designed for secure and efficient certificate storage and management. It leverages Auth0 for secure authentication and implements user-specific schemas with distinct databases to ensure personalized access and management. The scope encompasses certificate storage, authentication, and database functionalities tailored to streamline certificate management. Certificate Hub prioritizes security and accessibility, offering a focused solution for individuals and organizations seeking a robust certificate storage platform.",
    TechStack : "React , Node , Tailwind , MongoDb , Auth0 And Express",
    Learnings : "From this project, I gained insights into secure authentication using Auth0 and implementing user-specific schemas for database management. Learning to streamline certificate storage enhanced my skills in security-focused application development and personalized user experiences."
  },
  {
    id: 4,
    title: "Code Leagalist",
    description: "Code Leagalist: A Smart India Hackathon project advancing to finals. Designed a digital assistant for legal awareness and a KYC framework in India.",
    image: "/images/projects/codeleagalist.jpg",
    tag: ["All", "Web"],
    gitUrl: "/",
    previewUrl: "https://code-legalist.vercel.app/",
    aim:"To Craete A legal Awareness KYR System At Smart India Hackathon",
    LongDescrption : "",
    TechStack : "React , NLP , Python ,JavaScript , HTML , CSS , JSon , ",
    Learnings : "d"
  },
  {
    id: 5,
    title: "Js Minds",
    description: "JS Minds: Your Interactive Beginner's Guide to JavaScript with HTML, CSS, and JS. Learn through hands-on code examples, clear explanations, and useful references.",
    image: "/images/projects/jsminds.jpg",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/Jainprashuk/Js_Minds",
    previewUrl: "https://js-minds.vercel.app/",
    aim:"Building Interactive Beginner's Guide to JavaScript",
    LongDescrption : "I refreshed my JavaScript skills and put them to the test by building a documentation website using HTML, CSS, and Tailwind CSS. This project allowed me to demonstrate my understanding of JavaScript concepts while creating a practical resource for others. I utilized Tailwind CSS to streamline styling and focus more on functionality. The website serves as both a learning tool for myself and a reference for anyone seeking JavaScript documentation. It was a rewarding experience that solidified my knowledge and provided a platform to showcase my skills in web development and JavaScript.",
    TechStack : "HTML , CSS , tailwind And Javascript",
    Learnings : " Mastering JavaScript fundamentals strengthened my programming skills through variables, functions, conditionals, and loops. Building user-friendly interfaces with HTML, CSS, and Tailwind CSS improved my ability to create visually appealing web designs. Organizing content effectively on the documentation website enhanced my skills in categorization, navigation design, and clear presentation of information. Enhancing interactivity using JavaScript facilitated live code examples, compiler functionality, and dynamic content for engaging learning experiences."
  },
  {
    id: 6,
    title: "IEEE CIS LPU",
    description: "Developed a website for the IEEE CIS LPU chapter in my role as the web lead. The purpose of this website is to highlight information about the chapter and its various events.",
    image: "/images/projects/ieeecislpu.jpg",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/piyushdubey490/IEEE_CIS_LPU",
    previewUrl: "https://ieeecislpu.tech/",
    aim:"To Build An Online Identity For An organisation To showcase there events",
    LongDescrption : "Create an impactful online identity for an organization by showcasing their events effectively. Develop a dynamic website that highlights upcoming and past events, incorporating engaging visuals and user-friendly navigation. Utilize modern web design techniques, including responsive layouts and interactive elements, to enhance the user experience. Implement features like event calendars, registration forms, and multimedia content to attract and inform visitors. Optimize the site for search engines and social media sharing to increase visibility and reach. By building this online platform, the organization can establish a strong digital presence, connect with their audience, and promote their events efficiently.",
    TechStack : "Next , Typescript , Tailwind",
    Learnings : "The most valuable lesson from this project was honing team leadership skills through task delegation and effective collaboration. Leading taught me to coordinate tasks, leverage strengths, and foster teamwork. It deepened my understanding of leadership dynamics and equipped me with essential skills for future collaborative projects.    "
  },
  {
    id: 7,
    title: "Dsa-Repo",
    description: "I've crafted a straightforward webpage for easy access to my GitHub repository, where you can find all my data structures and algorithms codes.",
    image: "/images/projects/dsa.jpg",
    tag: ["All", "others"],
    gitUrl: "https://github.com/Jainprashuk/Data-Structure-Algorithm",
    previewUrl: "https://dsa-webpage.vercel.app/",
    aim:"To showCase My Github Respository For my Data structures Algorithm Codes",
    LongDescrption : "Highlight my GitHub repository showcasing data structures and algorithm codes. This collection demonstrates my proficiency in problem-solving and coding. Explore examples, explanations, and contributions to showcase my skills and passion for software development.",
    TechStack : "HTML, CSS & JavaScript",
    Learnings : "In this project, my focus and learning revolved around mastering essential data structures and algorithms (DSA) topics. Through my GitHub repository, I showcased a robust collection of DSA examples, explanations, and contributions. This experience deepened my problem-solving skills and underscored my commitment to continuous learning in software development"
  },
  {
    id: 8,
    title: "Parking Managment System",
    description: "Project 5 description",
    image: "/images/projects/6.png",
    tag: ["All", "others"],
    gitUrl: "/",
    previewUrl: "/",
    aim:"Implementing a Parking Management System aimed to reduce waiting times significantly",
    LongDescrption : "Implementing a Parking Management System was instrumental in reducing waiting times significantly. By optimizing parking allocation and streamlining entry and exit processes, the system efficiently managed vehicle flow. Real-time monitoring and data analytics helped identify peak hours and optimize resources accordingly, enhancing overall efficiency and customer satisfaction. This initiative not only reduced waiting times but also improved the overall parking experience for users.",
    TechStack : "Python , Tkinter",
    Learnings : "Python Concept + Tkinter for UI"
  },
  {
    id: 9,
    title: "TimeMaster",
    description: "Project 5 description",
    image: "/images/projects/6.png",
    tag: ["All", "others"],
    gitUrl: "/",
    previewUrl: "/",
    aim:"Developing a unified platform combining timer, stopwatch, and clock functionalities into a single interface",
    LongDescrption : "Create an integrated platform that combines timer, stopwatch, and clock functionalities into a seamless user interface. This unified solution allows users to set timers for specific tasks, utilize a stopwatch for precise timing, and view a digital or analog clock display. The platform will offer intuitive controls and customizable settings, catering to various timing needs efficiently. By consolidating these tools into one platform, users can easily manage time-related activities with convenience and clarity.",
    TechStack : "Java",
    Learnings : "Java Concepts"
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
              aim = {project.aim}
              LongDescrption = {project.LongDescrption}
              TechStack = {project.TechStack}
              Learnings = {project.Learnings}
            />
          </motion.li>
        ))}
      </ul>
    </section>
  );
};

export default ProjectsSection;


