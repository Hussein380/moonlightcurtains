const getApiBase = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  if (typeof window !== "undefined") {
    // Client-side: if not on localhost, use the relative backend service route prefix
    const hostname = window.location.hostname;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return `${window.location.origin}/_/backend/api`;
    }
  } else if (process.env.VERCEL_URL) {
    // Server-side on Vercel: use Vercel system variable to build the absolute URL
    return `https://${process.env.VERCEL_URL}/_/backend/api`;
  }
  
  // Default to local development backend
  return "http://localhost:5000/api";
};

export const API_BASE = getApiBase();

