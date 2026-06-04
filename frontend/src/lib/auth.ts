// Simple utility to manage auth token in localStorage for client-side
export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("admin_token", token);
  }
};

export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("admin_token");
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("admin_token");
  }
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};
