import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns";

const TopicsList = ({ topics }) => {
  return (
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
  );
};

export default TopicsList;
