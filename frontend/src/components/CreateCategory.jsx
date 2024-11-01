import React, { useState } from "react";
import { redirect, useNavigate, useParams } from "react-router-dom";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import axiosInstance from "../service/axiosInstance";
import "../styles/home.css";

function CreateCategory() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const label = { inputProps: { "aria-label": "Switch" } };

  const validateForm = () => {
    if (!name) {
      setError("Category name is required");
      return false;
    }
    setError("");
    return true;
  };

  const handleCreateCategory = async (event) => {
    if (!validateForm()) {
      return;
    }

    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post(`/categories/`, {
        name,
        is_private: isPrivate,
        is_locked: isLocked,
      });
      const newCategoryId = response.data.id;
      navigate(`/category/${newCategoryId}`);
    } catch (error) {
      console.error("Error creating category:", error);
      setError("An error ocurred");
      setLoading(true);
      redirect("/categories");
    } finally {
      setLoading(false);
      navigate(`/category/${newCategoryId}`);
    }
  };

  return (
    <div className="main-form-content">
      <div className="category-create-container">
        <h2 className="create-category-title">Create New Category</h2>
        <form className="category-form" onSubmit={handleCreateCategory}>
          <div className="form-group-category">
            <label htmlFor="name">Name</label>
            <textarea
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="switches">
            <div className="form-group-category">
              <label htmlFor="is-private">Private</label>
              <Switch
                {...label}
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                sx={{
                  "&.Mui-checked": {
                    color: "#136966",
                    "& .MuiSwitch-thumb": {
                      backgroundColor: "#ffffff",
                    },
                    "& + .MuiSwitch-track": {
                      backgroundColor: "#e0e0e0",
                    },
                  },
                  "& .MuiSwitch-thumb": {
                    backgroundColor: "#ffffff",
                  },
                  "& + .MuiSwitch-track": {
                    backgroundColor: "#c0c0c0",
                  },
                }}
              />
            </div>
            <div className="form-group-category">
              <label htmlFor="is-locked">Locked</label>
              <Switch
                {...label}
                checked={isLocked}
                onChange={(e) => setIsLocked(e.target.checked)}
                sx={{
                  "&.Mui-checked": {
                    color: "#4CAF50",
                    "& .MuiSwitch-thumb": {
                      backgroundColor: "#ffffff",
                    },
                    "& + .MuiSwitch-track": {
                      backgroundColor: "#e0e0e0",
                    },
                  },
                  "& .MuiSwitch-thumb": {
                    backgroundColor: "#ffffff",
                  },
                  "& + .MuiSwitch-track": {
                    backgroundColor: "#c0c0c0",
                  },
                }}
              />
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="create-category-button"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Category"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateCategory;
