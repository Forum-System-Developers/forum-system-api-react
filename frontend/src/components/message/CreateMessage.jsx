import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../../service/axiosInstance";
import "../../styles/topics.css";

function CreateMessage() {
    const navigate = useNavigate();

    const [receiver, setReceiver] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
    if (!receiver || !content) {
        setError("Both recipient and content are required");
        return false;
    }

    if (receiver.length < 2 || receiver.length > 30) {
        setError("Receiver username must be between 2 and 30 characters");
        return false;
    }

    if (content.length < 1 || content.length > 999) {
        setError("The message must be between 1 and 999 characters");
        return false;
    }

    setError("");
        return true;
    };

    const handleCreateMessage = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            await axiosInstance
                .post("/messages/by-username", {
                    content: content,
                    receiver_username: receiver,
                });
            navigate('/conversations');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError("User with this username does not exist");
            } else if (error.response && error.response.status === 401) {
                setError("You need to log in before sending a message");
            } else {
                setError("An error ocurred");
                setLoading(true);
            }
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="main-form-content">
      <div className="topic-create-container">
        <h2 className="create-topic-title">Create New Message</h2>
        <form className="topic-form" onSubmit={handleCreateMessage}>
          <div className="form-group-topic">
            <label htmlFor="receiver">Recipient</label>
            <textarea
              type="text"
              id="receiver"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              required
            />
          </div>

          <div className="form-group-topic">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          {error && <div className="error-message">{error}</div>}
        <div>
          <button
            type="submit"
            className="create-topic-button"
            disabled={loading}
            style={{ marginRight: '10px' }}
          >
            {loading ? "Creating..." : "Create Message"}
          </button>
          <button
            className="create-topic-button"
            onClick={() => navigate("/conversations")}
          >
            Cancel
          </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateMessage;
