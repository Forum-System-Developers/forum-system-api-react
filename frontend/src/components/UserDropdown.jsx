import React, { useState } from 'react';

const UserDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        console.log("Logout clicked");
        // Add logout functionality here
    };

    return (
        <div className="user-dropdown">
            <button onClick={toggleDropdown}>User</button>
            {isOpen && (
                <div className="dropdown-menu">
                    <div>Messages</div>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
