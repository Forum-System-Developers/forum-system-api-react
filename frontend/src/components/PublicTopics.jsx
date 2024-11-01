import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/topics.css";
import { formatDistanceToNow, parseISO } from "date-fns";

const PublicTopics = () => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/topics/public")
      .then((response) => {
        setTopics(response.data);
      })
      .catch((error) => {
        console.error("Error fetching topics:", error);
      });
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
                <h4 className="post-description">
                  Posted{" "}
                  {formatDistanceToNow(parseISO(topic.created_at), {
                    addSuffix: true,
                  })}{" "}
                  | {topic.replies.length}{" "}
                  {topic.replies.length === 1 ? "reply" : "replies"}
                </h4>
              </div>
              <h3 className="topic-content">{topic.content}</h3>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PublicTopics;
