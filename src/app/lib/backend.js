// Base URL for the Portfolio_Backend (Express + MongoDB on the Oracle VM since
// Vercel paused the account, 2026-11-24). Every backend call goes through this;
// override with NEXT_PUBLIC_BACKEND_URL if the backend moves again.
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://portfolio-api.jainprashuk.in";
