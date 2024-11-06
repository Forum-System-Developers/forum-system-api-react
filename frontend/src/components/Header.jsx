import React, { useState } from "react";
import UserDropdown from "./UserDropdown";
import Search from "./Search";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ViewModuleRoundedIcon from "@mui/icons-material/ViewModuleRounded";
import ReorderRoundedIcon from "@mui/icons-material/ReorderRounded";
import { Link } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <header className="header">
      <ul>
        <li>
          <Link to="/topics/" className="home-button">
            <HomeRoundedIcon sx={{ fontSize: 38 }} />
            <span className="tooltip-text">Home</span>
          </Link>
        </li>
        <li>
          <Link to="/categories" className="categories-button">
            <ViewModuleRoundedIcon sx={{ fontSize: 38 }} />
            <span className="tooltip-text-category">Categories</span>
          </Link>
        </li>
      </ul>
      <Search />
      <UserDropdown />
    </header>
  );
};

export default Header;
