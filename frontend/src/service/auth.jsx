import { jwtDecode } from "jwt-decode";

export const isAdmin = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    return decoded.is_admin === true;
  } catch (error) {
    console.error("Token error:", error);
    return false;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token !== null;
};

export const currentUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.sub;
  } catch (error) {
    console.error("Token error:", error);
    return null;
  }
};
