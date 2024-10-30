import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../service/axiosInstance";
import "../styles/topics.css";

const CategoryDetail = () => {
  const { id } = useParams();
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const viewCategory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to be logged in to view this page");
        return;
      }

      axiosInstance
        .get(`/categories/${id}/topics`)
        .then((response) => {
          setTopics(response.data);
        })
        .catch((error) => {
          console.error("Error fetching category details:", error);
          setError("An error occurred while fetching category details");
        });
    };

    viewCategory();
  });

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>;
      </div>
    );
  }

  if (!Array.isArray(topics) || topics.length === 0)
    return <p>No topics found in this category.</p>;

  return (
    <div className="home-container">
      <h2 className="topic-title">Showing topics in this category</h2>
      <div className="topics">
        <ul>
          {topics.map((topic) => (
            <li key={topic.id}>
              <Link to="/topic/:id" className="topic-link">
                {topic.title}
              </Link>
              <p>{topic.content}</p>
              <p className="reply-count">Replies: {topic.replies.length}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryDetail;
