import React, { useEffect, useState } from "react";
import axiosInstance from "../service/axiosInstance";
import { useParams } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns";

const TopicDetail = () => {
  const { topic_id } = useParams();
  const [topic, setTopic] = useState(null);
  const [fetchError, setFetchError] = useState("");
  const [replyError, setReplyError] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchTopicDetails = async () => {
    try {
      const response = await axiosInstance.get(`/topics/${topic_id}`);
      setTopic(response.data);
    } catch (error) {
      if (error.response) {
        if (error.response.status == 403) {
          setFetchError("You do not have permission to view this topic.");
        } else if (error.response.status == 401) {
          setFetchError("You need to be logged in in order to access topics.");
        }
      } else {
        setFetchError(`Error fetching topic details: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    fetchTopicDetails();
  }, [topic_id]);

  const validateForm = () => {
    if (!content) {
      setReplyError("Content is required");
      return false;
    }
    setReplyError("");
    return true;
  };

  const openTextField = () => {
    setIsOpen((prev) => !prev);
    setReplyError("");
  };

  const createReply = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsOpen(false);
    setLoading(true);
    setReplyError("");

    try {
      const response = await axiosInstance.post(`/replies/${topic_id}`, {
        content,
      });
      setTopic((prevTopic) => ({
        ...prevTopic,
        replies: [...prevTopic.replies, response.data],
      }));
      setContent("");
      setIsOpen(false);
    } catch (error) {
      setReplyError(`An error ocurred: ${error.message}`);
      setLoading(true);
      navigate(`/topic/${topic_id}`);
    } finally {
      setLoading(false);
    }
  };

  if (!topic) return <div>Topic not found</div>;

  if (fetchError) {
    console.log(fetchError);
    return (
      <div className="error-container">
        <p className="error-message">{fetchError}</p>
      </div>
    );
  }

  const isLocked = () => {
    return topic.locked ? true : false;
  };

  return (
    <div className="home-container">
      <div className="topic-detail-container">
        <div className="topic-container">
          <h2 className="topic-title">{topic.title}</h2>
          <h3 className="topic-content">{topic.content}</h3>
          <h4 className="post-description">
            Posted{" "}
            {formatDistanceToNow(parseISO(topic.created_at), {
              addSuffix: true,
            })}
          </h4>
        </div>

        <div className="reply-buttons-container">
          <button
            className="add-reply-button"
            onClick={openTextField}
            title={isOpen ? "Cancel" : "Add reply"}
          >
            {isOpen ? "Cancel" : "Add reply"}
          </button>

          {isOpen && (
            <button
              className="submit-reply-button"
              onClick={createReply}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Reply"}
            </button>
          )}
        </div>

        {isOpen && (
          <div className="form-create-reply">
            <textarea
              type="text"
              id="reply"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your reply here"
              required
            />
            {replyError && (
              <div className="error-message-reply">{replyError}</div>
            )}
          </div>
        )}

        <h5 className="replies-title">
          {topic.replies.length}{" "}
          {topic.replies.length === 1 ? "reply" : "replies"}
        </h5>

        <ul className="replies-list">
          {topic.replies.map((reply) => (
            <li key={reply.id} className="reply-item">
              {reply.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TopicDetail;
