import { jwtDecode } from "jwt-decode";

export const isAdmin = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    console.log("What's in token:", decoded);

    return decoded.role === "admin";
  } catch (error) {
    console.error("Token error:", error);
    return false;
  }
};

export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};
