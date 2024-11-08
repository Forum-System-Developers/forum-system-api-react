import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../service/axiosInstance";
import "../../styles/topics.css";
import AddIcon from "@mui/icons-material/Add";
import TopicList from "../topics/TopicsList";

const CategoryDetail = () => {
  const { category_id } = useParams();
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState("");

  const fetchTopics = async () => {
    try {
      setError("");
      const response = await axiosInstance.get(
        `/categories/${category_id}/topics`
      );
      setTopics(response.data);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError("You do not have permission to view this category.");
      } else if (error.response && error.response.status === 401) {
        setError("You need to be logged in to view this page");
      } else {
        setError(
          `Error fetching category details: ${error.message || "Unknown error"}`
        );
      }
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [category_id]);

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>;
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="category-header">
        {topics.length === 0 ? (
          <h2 className="description">
            No topics found in this category, be the first to create one!
          </h2>
        ) : (
          <h2 className="description">Topics in this category</h2>
        )}
        <div className="button">
          <Link
            to={`/category/${category_id}/topics/new`}
            className="add-button"
          >
            <AddIcon sx={{ fontSize: 38 }} />
            <span className="button-text">Create new</span>
          </Link>
        </div>
      </div>
      <TopicList topics={topics} />
    </div>
  );
};

export default CategoryDetail;
