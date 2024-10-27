// TopicDetail.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../service/axiosInstance';
import { useParams } from 'react-router-dom'; 

const TopicDetail = () => {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/topics/${id}`)
      .then(response => {
        setTopic(response.data);
      })
      .catch(error => {
        console.error('Error fetching topic details:', error);
      });
  }, [id]);

  if (!topic) return <div>Topic not found</div>; 

  return (
    <div>
      <h1>{topic.title}</h1>
      <p>{topic.content}</p>
      <h2>Replies:</h2>
      <ul>
        {topic.replies.map((reply) => (
          <li key={reply.id}>
            {reply.content}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopicDetail;
