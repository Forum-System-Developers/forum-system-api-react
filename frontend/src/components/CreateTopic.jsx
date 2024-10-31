import React, { useState } from "react";
import { redirect, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../service/axiosInstance";
import "../styles/topics.css";

function CreateTopic() {
  const { category_id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!title || !content) {
      setError("Both title and content are required");
      return false;
    }
    setError("");
    return true;
  };

  const handleCreateTopic = async (event) => {
    if (!validateForm()) {
      return;
    }

    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post(`/topics/${category_id}/`, {
        title,
        content,
      });
      const newTopicId = response.data.id;
      navigate(`/topic/${newTopicId}`);
    } catch (error) {
      console.error("Error creating topic:", error);
      setError("An error ocurred");
      setLoading(true);
      redirect(`/category/${category_id}`);
    } finally {
      setLoading(false);
      navigate(`/topic/${newTopicId}`);
    }
  };

  return (
    <div className="main-form-content">
      <div className="topic-create-container">
        <h2 className="create-topic-title">Create New Topic</h2>
        <form className="topic-form" onSubmit={handleCreateTopic}>
          <div className="form-group-topic">
            <label htmlFor="title">Title</label>
            <textarea
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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

          <button
            type="submit"
            className="create-topic-button"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Topic"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateTopic;
