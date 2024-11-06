import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { isAdmin } from "../service/auth";
import AddIcon from "@mui/icons-material/Add";
import Switch from "@mui/material/Switch";
import { styled, alpha } from "@mui/material/styles";
import "../styles/home.css";
import axiosInstance from "../service/axiosInstance";

const GreenSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#136966",
    "&:hover": {
      backgroundColor: alpha("#136966", theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#136966",
  },
}));
// const label = { inputProps: { "aria-label": "Color switch demo" } };

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [categoryStates, setCategoryStates] = useState({});

  const label = { inputProps: { "aria-label": "Switch" } };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/categories/"
      );
      const initialStates = response.data.reduce((acc, category) => {
        acc[category.id] = {
          isPrivate: category.is_private,
          isLocked: category.is_locked,
        };
        return acc;
      }, {});
      setCategoryStates(initialStates);

      setCategories(response.data);
    } catch (error) {
      setError(`Error fetching categories: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleLockCategory = async (categoryId, isLocked) => {
    try {
      await axiosInstance.put(
        `/categories/${categoryId}/lock?is_locked=${isLocked}`
      );
      setCategoryStates((prevStates) => ({
        ...prevStates,
        [categoryId]: {
          ...prevStates[categoryId],
          isLocked,
        },
      }));
    } catch (error) {
      setError(`An error ocurred: ${error.message}`);
    }
  };

  const handlePrivateCategory = async (categoryId, isPrivate) => {
    try {
      await axiosInstance.put(
        `/categories/${categoryId}/private?is_private=${isPrivate}`,
        {
          is_private: isPrivate,
        }
      );
      setCategoryStates((prevStates) => ({
        ...prevStates,
        [categoryId]: {
          ...prevStates[categoryId],
          isPrivate,
        },
      }));
    } catch (error) {
      setError(`An error ocurred: ${error.message}`);
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>;
      </div>
    );
  }

  return (
    <div className="categories-container">
      <div className="button-header">
        {isAdmin() && (
          <>
            <div className="button">
              <Link to="/category/create" className="add-button">
                <AddIcon sx={{ fontSize: 38 }} />
                <span className="button-text">Create new</span>
              </Link>
            </div>
          </>
        )}
      </div>
      <div className="categories">
        {categories.map((category) => (
          <div key={category.id} className="category-box">
            <Link to={`/category/${category.id}`}>
              <h2 className="category-name">{category.name}</h2>
            </Link>
            <p>{category.topic_count} topics in this category</p>
            {isAdmin() && (
              <div className="switches">
                <div className="private-switch">
                  <label htmlFor="is-private">Private</label>
                  <GreenSwitch
                    {...label}
                    checked={categoryStates[category.id]?.isPrivate || false}
                    onChange={(e) => {
                      const newIsPrivate = e.target.checked;
                      handlePrivateCategory(category.id, newIsPrivate);
                    }}
                  />
                </div>
                <div className="lock-switch">
                  <label htmlFor="is-locked">Locked</label>
                  <GreenSwitch
                    {...label}
                    checked={categoryStates[category.id]?.isLocked || false}
                    onChange={(e) => {
                      const newIsLocked = e.target.checked;
                      handleLockCategory(category.id, newIsLocked);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
