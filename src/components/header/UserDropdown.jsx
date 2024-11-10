import React, { useState, useRef, useEffect } from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PermIdentityRoundedIcon from "@mui/icons-material/PermIdentityRounded";
import AppRegistrationRoundedIcon from "@mui/icons-material/AppRegistrationRounded";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../../service/axiosInstance";
import { set } from "date-fns";

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    if (isLoggedIn) {
      getCurrentUser();
    }
  };

  const handleLogout = async () => {
    setIsOpen(false);
    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      navigate("/login");
    } catch (error) {
      setError(
        "An error occurred while logging out, redirecting to login page..."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
    setIsOpen(false);
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleMessgaeRedirect = () => {
    navigate("/conversations");
    setIsOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getCurrentUser = async () => {
    try {
      const response = await axiosInstance.get(`/users/me`);
      setUsername(response.data.username);
    } catch (error) {
      setError(`Error fetching current user: ${error.response}`);
    }
  };

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
              <span className="logged-user">
                <img
                  src="/icon.png"
                  alt="User Icon"
                  className="user-icon"
                  style={{ width: "20px", height: "20px" }}
                />{" "}
                Hi, {username}
              </span>

              <button
                className="dropdown-item"
                title="Messages"
                onClick={handleMessgaeRedirect}
              >
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
