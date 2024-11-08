import React, { useState, useRef } from "react";
import MapsUgcRoundedIcon from "@mui/icons-material/MapsUgcRounded";
import Face5RoundedIcon from "@mui/icons-material/Face5Rounded";
import { useNavigate } from "react-router-dom";

const AuthorDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setUserDropdown((prev) => !prev);
  };

  return (
    <>
      <Face5RoundedIcon
        sx={{
          fontSize: 24,
        }}
        onClick={toggleDropdown}
        className="user-icon-button"
      />

      <div className="user-dropdown-x" ref={dropdownRef}>
        {userDropdown && (
          <div className="user-dropdown-menu">
            <button
              className="message-button"
              onClick={() => navigate("/conversations")}
            >
              <span>Message</span>
              <MapsUgcRoundedIcon sx={{ fontSize: 18 }} />
              <span className="tooltip-text">Message User</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AuthorDropdown;
