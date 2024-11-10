import React, { useState, useRef, useEffect } from "react";
import MapsUgcRoundedIcon from "@mui/icons-material/MapsUgcRounded";
import Face5RoundedIcon from "@mui/icons-material/Face5Rounded";
import { useNavigate } from "react-router-dom";
import "../../styles/topics.css";

const AuthorDropdown = ({ author }) => {
  const [userDropdown, setUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setUserDropdown((prev) => !prev);
  };

  const handleCreateConversation = () => {
    navigate("/conversations/new");
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setUserDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="user-icon-button">
        <Face5RoundedIcon
          sx={{
            fontSize: 24,
          }}
          onClick={toggleDropdown}
        />
        <span className="tooltip-message-user">Send message to {author}</span>
      </div>
      <div className="user-dropdown-x" ref={dropdownRef}>
        {userDropdown && (
          <div className="user-dropdown-menu">
            <button
              className="message-button"
              onClick={handleCreateConversation}
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
