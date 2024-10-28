"use client";

import { useRouter } from "next/navigation";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import EmailSection from "./components/EmailSection";
import Footer from "./components/Footer";
import AchievementsSection from "./components/AchievementsSection";
import CertificateSection from "./components/CertificationSection";

import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MailIcon from "@mui/icons-material/Mail";
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from "@mui/icons-material/Instagram";
import { useState, useEffect } from "react";
import { color } from "framer-motion";
import Link from "next/link";

const actions = [
  { icon: <InstagramIcon />, name: "Instagram", link: "https://www.instagram.com/29prashuk_jain/?igshid=YzVkODRmOTdmMw%3D%3D" },
  { icon: <WhatsAppIcon />, name: "WhatsApp", link: "https://api.whatsapp.com/send/?phone=916265831996&text=Hey+there+%2C+can+we+talk..&type=phone_number&app_absent=0" },
  { icon: <LinkedInIcon />, name: "LinkedIn", link: "https://www.linkedin.com/in/prashuk-jain-937a12212/" },
  { icon: <GitHubIcon />, name: "GitHub", link: "https://github.com/jainprashuk" },
];

export default function Home() {
  const router = useRouter();
  const [Theme, SetDarkMode] = useState(true);

  useEffect(() => {
    // Function to update theme state based on localStorage
    const updateTheme = () => {
      const theme = localStorage.getItem("theme");
      SetDarkMode(theme === "dark");
    };

    // Run the update once when component mounts
    updateTheme();

    // Listen to storage events and update theme on change
    window.addEventListener("storage", updateTheme);
    console.log(Theme);

    return () => {
      window.removeEventListener("storage", updateTheme);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-[#121212] dark:bg-gray-100">
      <Navbar />
      <div className="container mt-24 mx-auto px-12 py-4">
        <HeroSection />
        <AchievementsSection />
        <AboutSection />
        <ProjectsSection />
        <CertificateSection />
        <EmailSection />
      </div>
      <Footer />

      <Box
        sx={{
          height: 320,
          transform: "translateZ(0px)",
          flexGrow: 1,
          position: "fixed",
          bottom: "0.1rem",
          right: "0.1rem",
        }}
      >
        <div>
          <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
              // backgroundColor: 'red dark:bg-red-900'
            }}
            className="text-blue-600 dark:text-red-900"
            // className="text-blue-600 dark:text-red-900"
            icon={
              <SpeedDialIcon className="text-gray-100 dark:text-gray-900" />
            }
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                className="text-gray-100 bg-gray-500 dark:bg-gray-200 dark:text-gray-900"
                onClick={() => (window.location.href = action.link)} // Navigate when clicked
              />
            ))}
          </SpeedDial>
        </div>
      </Box>
    </main>
  );
}
