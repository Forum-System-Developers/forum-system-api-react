import React, { useEffect, useState } from "react";
import axios from "axios";
import TopicList from "./TopicsList";
import "../styles/topics.css";

const PublicTopics = () => {
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState("");

  const fetchTopics = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/topics/public"
      );
      setTopics(response.data);
    } catch (error) {
      setError(`Error fetching topics: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h2 className="description">Latest posts</h2>
      <TopicList topics={topics} />
    </div>
  );
};

export default PublicTopics;
