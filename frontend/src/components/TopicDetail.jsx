import React, { useEffect, useState } from "react";
import axiosInstance from "../service/axiosInstance";
import { useParams } from "react-router-dom";

const TopicDetail = () => {
  const { topic_id } = useParams();
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/topics/${topic_id}`)
      .then((response) => {
        setTopic(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          console.error(
            "Error 403: Forbidden - You do not have permission to access this resource."
          );
          setError("You do not have permission to view this topic.");
        } else {
          console.error("Error fetching topic details:", error);
          setError("An error occurred while fetching topic details");
        }
      });
  }, [topic_id]);

  if (!topic) return <div>Topic not found</div>;

  const isLocked = () => {
    return topic.locked ? true : false;
  };

  return (
    <div>
      <h1>{topic.title}</h1>
      <p>{topic.content}</p>
      <h2>Replies:</h2>
      <ul>
        {topic.replies.map((reply) => (
          <li key={reply.id}>{reply.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default TopicDetail;
