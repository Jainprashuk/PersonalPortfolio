"use client";

import { useEffect } from "react";
import { initBugTracker } from "bug-tracker-sdk";
import axios from "axios";

export default function BugTrackerInit() {
  useEffect(() => {
    initBugTracker({
      apiKey: process.env.NEXT_PUBLIC_BUG_TRACKER_API_KEY,
      axios,
      features: {
        capturePerformance: true,
        captureScreenshots: {
          fetchErrors: true,
          axiosErrors: true,
          consoleErrors: true,
        }
      }
    });
  }, []);

  return null;
}