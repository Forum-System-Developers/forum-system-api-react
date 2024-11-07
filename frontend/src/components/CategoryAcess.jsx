import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/home.css";
import SearchAutocomplete from "./AutocompleteBar";
import axiosInstance from "../service/axiosInstance";
import Checkbox from "@mui/material/Checkbox";

const CategoryAccess = () => {
  const { category_id } = useParams();
  const [users, setUsers] = useState([]);
  const [privilegedUsers, setPrivilegedUsers] = useState([]);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/users/");
      const allUsers = response.data;
      const filteredUsers = allUsers.filter(
        (user) =>
          !privilegedUsers.some(
            (privilegedUser) => privilegedUser.id === user.id
          )
      );

      setUsers(filteredUsers);
    } catch (error) {
      setError(`Error fetching users: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchPrivilegedUsers();
  }, [category_id]);

  useEffect(() => {
    if (privilegedUsers.length > 0) {
      fetchUsers();
    }
  }, [privilegedUsers]);

  const fetchPrivilegedUsers = async () => {
    try {
      const response = await axiosInstance.get(
        `/users/permissions/${category_id}`
      );
      setPrivilegedUsers(response.data);
    } catch (error) {
      setError(`Error fetching privileged users: ${error.message}`);
    }
  };

  const grantUserAccess = async (userId) => {
    try {
      await axiosInstance.put(
        `/users/${userId}/permissions/${category_id}/read`
      );
      const user = users.find((user) => user.id === userId);
      setPrivilegedUsers((prevUsers) => [...prevUsers, user]);
    } catch (error) {
      setError(`Error granting access: ${error.message}`);
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
    <div className="home-container">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div className="search-bar-users">
            <SearchAutocomplete
              options={users}
              label="Add user"
              getOptionLabel={(option) => option.username}
              onOptionSelect={(option) => grantUserAccess(option.id)}
              sx={{
                width: "200px",
                height: "50px",
                marginBottom: "15px",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "#fbfbfb88",
                  "& fieldset": {
                    borderColor: "#b7b7b7",
                  },
                  "&:hover fieldset": {
                    borderColor: "#b7b7b7",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#b7b7b7",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "#818181",
                  fontSize: "14px",
                  fontWeight: "500",
                },
              }}
            />
          </div>
        </div>

        <div className="priviledged-users-list">
          <h5 className="users-title">
            {privilegedUsers?.length === 0
              ? "No access permissions granted for this category"
              : "Privileged users:"}
          </h5>
          <div className="priviledged-users-list">
            <ul>
              {privilegedUsers.map((user) => (
                <li key={user.id}>
                  <div className="user-access-list-item">
                    <div className="user-info">
                      <p className="username-list">{user.username}</p>
                    </div>
                    <div className="checkboxes">
                      <Checkbox
                        defaultChecked
                        sx={{
                          color: "#197769e0",
                          "&.Mui-checked": {
                            color: "#197769e0",
                          },
                        }}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryAccess;
