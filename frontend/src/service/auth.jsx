import jwtDecode from "jwt-decode";

const isAdmin = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    console.log("What's in token:", decoded);
    return decoded.admin === "true";
  } catch (error) {
    console.error("Token error:", error);
    return false;
  }
};

const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

export default { isAdmin, isAuthenticated };
