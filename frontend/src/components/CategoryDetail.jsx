import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../service/axiosInstance";
import "../styles/topics.css";
import AddIcon from "@mui/icons-material/Add";
import { formatDistanceToNow, parseISO } from "date-fns";

const CategoryDetail = () => {
  const { category_id } = useParams();
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
        .get(`/categories/${category_id}/topics`)
        .then((response) => {
          setTopics(response.data);
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            console.error(
              "Error 403: Forbidden - You do not have permission to access this resource."
            );
            setError("You do not have permission to view this category.");
          } else {
            console.error("Error fetching category details:", error);
            setError("An error occurred while fetching category details");
          }
        });
    };

    viewCategory();
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
      <div className="topics">
        <ul>
          {topics.map((topic) => (
            <li key={topic.id}>
              <div className="post-header">
                <Link to={`/topic/${topic.id}`}>
                  <h2 className="topic-title">{topic.title}</h2>
                </Link>
                <p className="post-description">
                  Posted{" "}
                  {formatDistanceToNow(parseISO(topic.created_at), {
                    addSuffix: true,
                  })}{" "}
                  | {topic.replies.length}{" "}
                  {topic.replies.length === 1 ? "reply" : "replies"}
                </p>
              </div>
              <h3 className="topic-content">{topic.content}</h3>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryDetail;
