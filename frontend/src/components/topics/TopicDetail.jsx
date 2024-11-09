import React, { useEffect, useState } from "react";
import AuthorDropdown from "./AuthorDropdown";
import Replies from "./Replies";
import HttpsRoundedIcon from "@mui/icons-material/HttpsRounded";
import axiosInstance from "../../service/axiosInstance";
import { useParams } from "react-router-dom";
import { formatDistanceToNow, parseISO, set } from "date-fns";
import { isAdmin } from "../../service/auth";

const TopicDetail = () => {
  const { topic_id } = useParams();
  const [topic, setTopic] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTopicDetails = async () => {
    try {
      const response = await axiosInstance.get(`/topics/${topic_id}`);
      setTopic(response.data);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          setFetchError("You do not have permission to view this topic.");
        } else if (error.response.status === 401) {
          setFetchError("You need to be logged in to access topics.");
        }
      } else {
        setFetchError(`Error fetching topic details: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopicDetails();
  }, [topic_id]);

  const handleLockTopic = async () => {
    setIsOpen(false);
    const isLocked = !topic.is_locked;

    try {
      await axiosInstance.patch(`/topics/${topic_id}/lock`, {
        is_locked: isLocked,
      });
      setTopic((prevTopic) => ({
        ...prevTopic,
        is_locked: isLocked,
      }));
      setLoading(true);
    } catch (error) {
      setFetchError(`Error locking topic: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isLocked = () => {
    return topic.is_locked ? true : false;
  };

  if (loading) return <div>Loading...</div>;

  if (fetchError)
    return (
      <div className="error-container">
        <p className="error-message">{fetchError}</p>
      </div>
    );

  return (
    <>
      {isAdmin() && (
        <div className="admin-header">
          <button onClick={handleLockTopic} className="button">
            <span className="lock-icon">
              <HttpsRoundedIcon sx={{ fontSize: 24 }} />
            </span>
            <span>{topic.is_locked ? "Unlock Topic" : "Lock Topic"}</span>
          </button>
        </div>
      )}

      <div className="topic-detail-container">
        <div className="topic-container">
          <div className="author-container">
            <div className="author">
              <AuthorDropdown />
              <span className="author-name">{topic.author}</span>
            </div>
            <h4 className="post-description">
              Posted{" "}
              {formatDistanceToNow(parseISO(topic.created_at), {
                addSuffix: true,
              })}
            </h4>
          </div>
          <div className="topic-main">
            <h2 className="topic-title">{topic.title}</h2>
            <h3 className="topic-content">{topic.content}</h3>
          </div>
        </div>
        <Replies
          topic={topic}
          isLocked={isLocked}
          setTopic={setTopic}
          fetchTopicDetails={fetchTopicDetails}
        />
      </div>
    </>
  );
};

export default TopicDetail;
