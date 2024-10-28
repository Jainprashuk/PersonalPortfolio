"use client";
import { dark } from "@mui/material/styles/createPalette";
import React, { useEffect, useState } from "react";

const ThemeToogler = () => {
  const [DarkMode, SetDarkMode] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      SetDarkMode(true);
    } else {
      SetDarkMode(false);
    }
  }, []);

  useEffect(() => {
    if (DarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [DarkMode]);

  return (
    <div className="text-gray-100 flex justify-center align-center" onClick={() => SetDarkMode(!DarkMode)}>
      <button
        
        className={`toggle-btn text-2xl`}
      >
        {DarkMode ? "🌙" : "☀️"}
      </button>
    </div>
  );
};

export default ThemeToogler;
