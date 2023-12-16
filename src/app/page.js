import React from "react";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import EmailSection from "./components/EmailSection";
import Footer from "./components/Footer";
import AchievementsSection from "./components/AchievementsSection";
import CertificateSection from "./components/CertificationSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#121212]">
      <Navbar />
      <div className="container mt-24 mx-auto px-12 py-4">
        <HeroSection />
        <AchievementsSection />
        <AboutSection />
        <ProjectsSection />
        <CertificateSection/>
        <EmailSection />
        
        {/* Placeholder div for the chatbot */}
        <div id="chatbot-container"></div>

        {/* Button to load chatbot on the client-side */}
        <button
          id="chatbot-toggle-button"
          className="chatbot-toggle-button"
          onClick={loadChatbot}
        >
          Show Chatbot
        </button>
      </div>
      <Footer />
    </main>
  );
}

// Function to load the chatbot on the client-side
function loadChatbot() {
  // Dynamically create an iframe for the chatbot
  const iframe = document.createElement("iframe");
  iframe.title = "Chatbot";
  iframe.src = "path_to_your_chatbot_iframe";
  iframe.width = "300"; // Set your preferred width
  iframe.height = "400"; // Set your preferred height
  iframe.frameBorder = "0";
  iframe.allowFullScreen = true;
  iframe.className = "chatbot-iframe";

  // Append the iframe to the container div
  const container = document.getElementById("chatbot-container");
  container.innerHTML = '';
  container.appendChild(iframe);
}
