import React, { useState } from 'react';
import UserDropdown from './UserDropdown';

const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <header className="header">
            <button className="home-button">Home</button>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
            />
            <UserDropdown />
        </header>
    );
};

export default Header;
