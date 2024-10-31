import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { isAdmin } from "../service/auth";
import "../styles/home.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/categories/")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  return (
    <div className="categories-container">
      {isAdmin ? <div className="add-category"></div> : <></>}
      <div className="categories">
        {categories.map((category) => (
          <div key={category.id} className="category-box">
            <Link to={`/category/${category.id}`}>
              <h2 className="category-name">{category.name}</h2>
            </Link>
            <p>{category.topic_count} topics in this category</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
