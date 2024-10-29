import React, { useState, useRef, useEffect } from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PermIdentityRoundedIcon from "@mui/icons-material/PermIdentityRounded";
import AppRegistrationRoundedIcon from "@mui/icons-material/AppRegistrationRounded";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../service/axiosInstance";

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      const response = await axiosInstance.post("/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      setError(
        "An error occurred while logging out, redirecting to login page..."
      );
      navigate("/login");
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="user-dropdown" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="user-button">
        <PermIdentityRoundedIcon sx={{ fontSize: 30 }} />
        <span className="tooltip-text">User</span>
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {!isLoggedIn ? (
            <>
              <button
                onClick={handleLoginRedirect}
                title="Login"
                className="dropdown-item"
              >
                <LoginIcon fontSize="small" />
                <span>Login</span>
              </button>
              <button
                onClick={handleRegisterRedirect}
                title="Sign Up"
                className="dropdown-item"
              >
                <AppRegistrationRoundedIcon fontSize="small" />
                <span>Register</span>
              </button>
            </>
          ) : (
            <>
              <button className="dropdown-item" title="Messages">
                <MailOutlineIcon fontSize="small" />
                <span>Messages</span>
              </button>
              <button
                className="dropdown-item"
                onClick={handleLogout}
                title="Logout"
              >
                <LogoutIcon fontSize="small" />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
