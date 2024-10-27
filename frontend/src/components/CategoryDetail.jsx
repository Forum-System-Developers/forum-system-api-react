import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../service/axiosInstance';

const CategoryDetail = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/categories/${id}/topics`)
      .then(response => {
        setCategory(response.data);
      })
      .catch(error => {
        console.error('Error fetching category details:', error);
      });
  }, [id]);

  if (!category) return <p>Category not found</p>;

  return (
    <div>
      <h1>{category.name}</h1>
      <h2>Topics:</h2>
      <ul>
        {topics.map(topic => (
          <li key={topic.id}>
            <h3>{topic.title}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryDetail;
