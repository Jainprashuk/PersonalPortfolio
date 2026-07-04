"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import AboutSection from "./components/AboutSection";
import { useState, useEffect } from "react";

// Below-the-fold sections are code-split so the initial bundle only
// contains what's needed to render the hero/nav/about above the fold.
const ProjectsSection = dynamic(() => import("./components/ProjectsSection"));
const EmailSection = dynamic(() => import("./components/EmailSection"));
const Footer = dynamic(() => import("./components/Footer"));
const AchievementsSection = dynamic(() => import("./components/AchievementsSection"));
const CertificateSection = dynamic(() => import("./components/CertificationSection"));
const ContactSpeedDial = dynamic(() => import("./components/ContactSpeedDial"), { ssr: false });

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

    return () => {
      window.removeEventListener("storage", updateTheme);
    };
  }, []);

  // UUID generation function
  function generateUUID() {
    return 'xxxxxxxxyxxxxyxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Cookie handling functions
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  }

  // Track visit function
  async function trackVisit() {
    let userId = getCookie('user_id');
    if (!userId) {
      userId = generateUUID();  // Generate a new unique ID
      setCookie('user_id', userId, 365);  // Store for 1 year
    }

    // Send visit data to the backend
    try {
      const response = await fetch('https://portfolio-backend-two-zeta.vercel.app/visit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, timestamp: new Date() }),
      });
      const data = await response.json();
      console.log("Visit data sent to server", data);
    } catch (error) {
      console.error("Error tracking visit:", error);
    }

    console.log("Tracking user with ID: ", userId);
  }

  // Call this on page load to track visit
  useEffect(() => {
    trackVisit();
  }, []);

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
    title: "Blogs",
    path: "/blog",
  },
  {
    title: "Certificates",
    path: "#certificates",
  },
  {
    title: "Contact Me",
    path: "#contact",
  },
  // {
  //   title: "Visitors Analytics",
  //   path: "/Insights",
  // },
  {
    title: "Admin",
    path: "/Admin/response",
  }
];

  return (
    <main className="flex min-h-screen flex-col bg-[#121212] dark:bg-gray-100">
      <Navbar navLinks={navLinks} />
      <div className="container mt-24 mx-auto px-12 py-4">
        <HeroSection />
        <AchievementsSection />
        <AboutSection />
        <ProjectsSection />
        <CertificateSection />
        <EmailSection />
      </div>
      <Footer />

      <ContactSpeedDial />
    </main>
  );
}
