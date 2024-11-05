import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../service/axiosInstance";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import MapsUgcRoundedIcon from "@mui/icons-material/MapsUgcRounded";
import HttpsRoundedIcon from "@mui/icons-material/HttpsRounded";
import Face5RoundedIcon from "@mui/icons-material/Face5Rounded";
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns";
import { currentUser, isAdmin } from "../service/auth";

const TopicDetail = () => {
  const { topic_id } = useParams();
  const [topic, setTopic] = useState(null);
  const [fetchError, setFetchError] = useState("");
  const [replyError, setReplyError] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const dropdownRef = useRef(null);

  const navigate = useNavigate();

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

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setUserDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectBestReply = async (replyId) => {
    try {
      const response = await axiosInstance.patch(
        `/topics/${topic.id}/replies/${replyId}/best`
      );
      setTopic((prevTopic) => ({
        ...prevTopic,
        best_reply_id: replyId,
      }));
      setLoading(true);
    } catch (error) {
      setFetchError(`Error fetching best reply: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    setUserDropdown((prev) => !prev);
  };

  const validateForm = () => {
    if (!content) {
      setReplyError("Content is required");
      return false;
    }

    if (content.length > 20) {
      setReplyError("Reply cannot be longer than 20 characters");
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
      setLoading(true);
    } catch (error) {
      setReplyError(`An error ocurred: ${error.message}`);
      setLoading(true);
      navigate(`/topic/${topic_id}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLockTopic = async () => {
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

  const handleVote = async (replyId, isUpvote) => {
    try {
      const response = await axiosInstance.patch(`/replies/${replyId}`, {
        reaction: isUpvote,
      });
      const updatedReply = response.data;

      setTopic((prevTopic) => {
        const newReplies = prevTopic.replies.map((reply) =>
          reply.id === replyId ? updatedReply : reply
        );
        return {
          ...prevTopic,
          replies: newReplies,
        };
      });

      setLoading(true);
    } catch (error) {
      console.error("Error voting reply:", error);
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
    <div className="home-container">
      {isAdmin() && (
        <div className="lock-topic">
          <span className="lock-icon" onClick={handleLockTopic}>
            <HttpsRoundedIcon sx={{ fontSize: 24 }} />
          </span>
          <span>{topic.is_locked ? "Unlock Topic" : "Lock Topic"}</span>
        </div>
      )}

      <div className="topic-detail-container">
        <div className="topic-container">
          <div className="author-container">
            <Face5RoundedIcon
              sx={{
                fontSize: 24,
              }}
              onClick={toggleDropdown}
              className="user-icon-button"
            />

            <div className="user-dropdown-x" ref={dropdownRef}>
              {userDropdown && (
                <div className="user-dropdown-menu">
                  <button className="message-button">
                    <span>Message</span>
                    <MapsUgcRoundedIcon sx={{ fontSize: 18 }} />
                    <span className="tooltip-text">Message User</span>
                  </button>
                </div>
              )}
            </div>

            <span className="author-name">{topic.author}</span>
          </div>
          <div className="topic-main">
            <h2 className="topic-title">{topic.title}</h2>
            <h3 className="topic-content">{topic.content}</h3>
            <h4 className="post-description">
              Posted{" "}
              {formatDistanceToNow(parseISO(topic.created_at), {
                addSuffix: true,
              })}
            </h4>
          </div>
        </div>

        <div className="reply-buttons-container">
          {!isLocked() && (
            <button
              className="add-reply-button"
              onClick={openTextField}
              title={isOpen ? "Cancel" : "Add reply"}
            >
              {isOpen ? "Cancel" : "Add reply"}
            </button>
          )}

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
          {topic?.replies?.length || 0}{" "}
          {topic?.replies?.length === 1 ? "reply" : "replies"}
        </h5>

        <div className="replies">
          <ul className="replies-list">
            {topic?.replies?.map((reply) => (
              <li
                key={reply.id}
                className={`reply-item ${reply.id === topic.best_reply_id ? "best-reply-item" : ""}`}
              >
                <div className="reply-with-votes">
                  {reply.content}
                  <div className="votes">
                    <span
                      className="upvotes"
                      onClick={() => handleVote(reply.id, true)}
                    >
                      <ThumbUpOutlinedIcon sx={{ fontSize: 18 }} />
                      <span className="vote-count">{reply.upvotes}</span>
                    </span>
                    <span
                      className="downvotes"
                      onClick={() => handleVote(reply.id, false)}
                    >
                      <ThumbDownOutlinedIcon sx={{ fontSize: 18 }} />{" "}
                      <span className="vote-count">{reply.downvotes}</span>
                    </span>
                  </div>
                </div>
                <div className="description-star">
                  <h4 className="post-description">
                    Posted{" "}
                    {formatDistanceToNow(parseISO(topic.created_at), {
                      addSuffix: true,
                    })}
                  </h4>
                  {currentUser() === topic.author_id && (
                    <div
                      className="best-reply-star"
                      onClick={() => selectBestReply(reply.id)}
                    >
                      <StarBorderRoundedIcon
                        className={`best-reply-star ${reply.id === topic.best_reply_id ? "gold-star" : ""}`}
                        sx={{ fontSize: 24 }}
                      />
                      <span className="tooltip">Select Best Reply</span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;
