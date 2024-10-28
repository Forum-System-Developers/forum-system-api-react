import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const Categories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/v1/categories/')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            })
    }, []);

        return (
            <div className='categories'>
            <ul>
                {categories.map((category) => (
                <li key={category.id}>
                    <Link to={`/category/${category.id}`}>
                    <h2>{category.name}</h2>
                    </Link>
                    <p>{category.topic_count} topics in this category</p>
                </li>
                ))}
            </ul>
            </div>
        );
        }

export default Categories;
