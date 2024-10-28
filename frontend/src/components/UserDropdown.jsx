import React, { useState, useRef, useEffect } from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import PermIdentityRoundedIcon from "@mui/icons-material/PermIdentityRounded";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../service/axiosInstance";

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [error, setError] = useState("");

  // const history = useHistory();
  const navigate = useNavigate();

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
        <PermIdentityRoundedIcon sx={{ fontSize: 38 }} />
        <span className="tooltip-text">User</span>
      </button>
      {isOpen && (
        <div className="dropdown-menu">
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
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
