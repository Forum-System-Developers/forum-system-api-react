import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/home.css";
import axiosInstance from "../service/axiosInstance";
import { isAuthenticated } from "../service/auth";

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axiosInstance
      .get("/topics/")
      .then((response) => {
        setTopics(response.data);
      })
      .catch((error) => {
        console.error("Error fetching topics:", error);
      });
  }, []);

  return (
    <div className="home-container">
      <h2 className="topic-title">Latest posts</h2>
      <div className="topics">
        <ul>
          {topics.map((topic) => (
            <li key={topic.id}>
              <Link to={`/topic/${topic.id}`}>
                <h2>{topic.title}</h2>
              </Link>
              <ul>
                {topic.replies.map((reply) => (
                  <li key={reply.id}>{reply.content}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Topics;
