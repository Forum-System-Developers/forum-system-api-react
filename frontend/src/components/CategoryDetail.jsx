import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../service/axiosInstance";

const CategoryDetail = () => {
  const { id } = useParams();
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You need to be logged in to view this page");
      if (error) return <p>{error}</p>;
      return;
    }

    axiosInstance
      .get(`/categories/${id}/topics`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTopics(response.data);
      })
      .catch((error) => {
        console.error("Error fetching category details:", error);
        setError("An error occurred while fetching category details");
      });
  }, [id]);

  if (error) return <p>{error}</p>;

  if (!Array.isArray(topics) || topics.length === 0)
    return <p>No topics found in this category.</p>;

  return (
    <div>
      <h2>Showing latest topics in this category: </h2>
      <ul>
        {topics.map((topic) => (
          <li key={topic.id}>
            <h3>{topic.title}</h3>
            <p>{topic.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryDetail;
