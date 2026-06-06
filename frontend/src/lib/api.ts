/**
 * Central API configuration.
 * ALL fetch calls in the frontend must use API_BASE — never hardcode localhost.
 *
 * In production: set NEXT_PUBLIC_API_URL to your deployed backend URL in Vercel.
 * In development: falls back to localhost:5000.
 */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
