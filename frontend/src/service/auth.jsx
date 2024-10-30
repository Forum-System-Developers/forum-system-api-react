// import { jwtDecode } from "jwt-decode";

// export const isAdmin = () => {
//   const token = localStorage.getItem("token");
//   if (!token) return false;

//   try {
//     const { default: jwtDecode } = require("jwt-decode");
//     const payload = jwtDecode(token);
//     return payload.role === "admin";
//   } catch (error) {
//     console.error("Invalid token:", error);
//     return false;
//   }
// };

export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};
