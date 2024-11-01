import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/home.css";
import axiosInstance from "../service/axiosInstance";
import { formatDistanceToNow, parseISO } from "date-fns";

const TopicsForUser = () => {
  const [topics, setTopics] = useState([]);
  const token = localStorage.getItem("token");

  const fetchTopics = async () => {
    if (!token) {
      return;
    }

    try {
      const response = await axiosInstance.get("/topics/");
      setTopics(response.data);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <div className="home-container">
      <h2 className="description">Latest posts</h2>
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

export default TopicsForUser;
