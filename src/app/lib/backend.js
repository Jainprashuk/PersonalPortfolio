// Base URL for the Portfolio_Backend (Express + MongoDB on Vercel).
// Same origin already used by /Admin/response. Override with an env var if the
// backend ever moves.
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://portfolio-backend-two-zeta.vercel.app";
