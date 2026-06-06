/**
 * Auth utilities — stores the admin JWT in a secure cookie.
 * 
 * Using cookies (vs localStorage) means:
 * 1. The middleware.ts can read the token SERVER-SIDE before any page renders.
 * 2. If we later add httpOnly flag via a server route, it becomes XSS-proof.
 */

const COOKIE_NAME = "admin_token";

const setCookie = (name: string, value: string, days: number) => {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
};

const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const setAuthToken = (token: string) => setCookie(COOKIE_NAME, token, 1);

export const getAuthToken = () => getCookie(COOKIE_NAME);

export const removeAuthToken = () => deleteCookie(COOKIE_NAME);

export const isAuthenticated = () => !!getAuthToken();
