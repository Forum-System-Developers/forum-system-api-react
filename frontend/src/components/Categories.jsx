import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { isAdmin } from "../service/auth";
import AddIcon from "@mui/icons-material/Add";
import "../styles/home.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/categories/"
      );
      setCategories(response.data);
    } catch (error) {
      setError(`Error fetching categories: ${error.message}`);
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>;
      </div>
    );
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="categories-container">
      <div className="button-header">
        {isAdmin() && (
          <>
            <div className="button">
              <Link to="/category/create" className="add-button">
                <AddIcon sx={{ fontSize: 38 }} />
                <span className="button-text">Create new</span>
              </Link>
            </div>
          </>
        )}
      </div>
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
