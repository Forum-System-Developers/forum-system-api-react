import React, { useState } from 'react';
import UserDropdown from './UserDropdown';
import Search from './Search';

const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <header className="header">
            <button className="home-button">Home</button>
            <Search />
            <UserDropdown />
        </header>
    );
};

export default Header;
