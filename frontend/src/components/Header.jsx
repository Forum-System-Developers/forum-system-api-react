import React, { useState } from 'react';
import UserDropdown from './UserDropdown';
import Search from './Search';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ReorderRoundedIcon from '@mui/icons-material/ReorderRounded';
import { Link } from 'react-router-dom';

const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <header className="header">
            <div className='home-categories'>
                <Link to='/topics/public' className="home-button">
                    <HomeRoundedIcon sx={{ fontSize: 38 }}/>
                    <span className="tooltip-text">Home</span>
                </ Link>
                <Link to='/categories' className='categories-button'>
                    <ReorderRoundedIcon sx={{ fontSize: 38 }}/>
                    <span className="tooltip-text-category">Categories</span>
                </ Link>
                <Search />
            </div>
            <UserDropdown />
        </header>
    );
};

export default Header;
