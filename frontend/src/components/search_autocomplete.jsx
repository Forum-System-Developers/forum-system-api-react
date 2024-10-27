import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SearchAutocomplete = () => {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);

    useEffect(() => {
        // Fetch categories using .then() syntax
        axios.get('http://127.0.0.1:8000/api/v1/categories/')
            .then(response => {
                console.log("API Response:", response.data); // Log the API response
                // Check if response is an array
                if (Array.isArray(response.data)) {
                    setCategories(response.data);
                } else {
                    console.error("Expected an array but got:", response.data);
                }
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
            });
    }, []);

    useEffect(() => {
        // Filter categories based on the search term
        const filtered = searchTerm
            ? categories.filter(category => 
                category.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : [];
        
        setFilteredCategories(filtered);
    }, [searchTerm, categories]);

    return (
        <div>
            <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredCategories.length > 0 ? (
                <ul>
                    {filteredCategories.map((category) => (
                        <li key={category.id}>{category.name}</li>
                    ))}
                </ul>
            ) : (
                searchTerm && <div>No categories found</div>
            )}
        </div>
    );
};

export default SearchAutocomplete;
