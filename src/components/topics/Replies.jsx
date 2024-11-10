import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import { currentUser } from "../../service/auth";
import React, { useState } from "react";
import axiosInstance from "../../service/axiosInstance";
import { useParams } from "react-router-dom";
import AuthorDropdown from "./AuthorDropdown";
import { formatDistanceToNow, parseISO } from "date-fns";

const Replies = ({
  topic,
  isLocked,
  setTopic,
  fetchTopicDetails,
  isOpen,
  setIsOpen,
}) => {
  const { topic_id } = useParams();
  const [replyError, setReplyError] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const openTextField = () => {
    setIsOpen((prev) => !prev);
    setReplyError("");
  };

  const validateForm = () => {
    if (!content) {
      setReplyError("Content is required");
      return false;
    }
    if (content.length > 999) {
      setReplyError("Reply cannot be longer than 999 characters");
      return false;
    }
    if (content.length < 5) {
      setReplyError("Reply cannot be less than 5 characters");
      return false;
    }
    setReplyError("");
    return true;
  };

  const createReply = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
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
      setLoading(true);
      setIsOpen(false);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setReplyError("You don't have permission to post in this category");
      } else {
        setReplyError(`An error ocurred: ${error.message}`);
      }
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  useState(() => {
    fetchTopicDetails();
  }, [topic_id, createReply]);

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
      if (error.response && error.response.status === 403) {
        setReplyError("Topic has been locked");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
        {replyError && <div className="error-message-reply">{replyError}</div>}
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
              <div className="author-reply-container">
                <div className="author-container">
                  <div className="author">
                    <AuthorDropdown author={reply.author} />
                    <span className="author-name">{reply.author}</span>
                  </div>
                  <div className="description-star">
                    <h4 className="post-description">
                      Posted{" "}
                      {formatDistanceToNow(parseISO(reply.created_at), {
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
                </div>
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
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Replies;
