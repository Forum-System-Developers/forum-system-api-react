import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/home.css";
import SearchAutocomplete from "../common/AutocompleteBar";
import axiosInstance from "../../service/axiosInstance";
import Checkbox from "@mui/material/Checkbox";

const CategoryAccess = () => {
  const { category_id } = useParams();
  const [users, setUsers] = useState([]);
  const [privilegedUsers, setPrivilegedUsers] = useState([]);
  const [writeAccessDisabled, setWriteAccessDisabled] = useState({});
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

  const fetchPrivilegedUsers = async () => {
    try {
      const response = await axiosInstance.get(
        `/users/permissions/${category_id}`
      );
      setPrivilegedUsers(response.data);

      const initialWriteAccessDisabled = {};
      response.data.forEach((user) => {
        initialWriteAccessDisabled[user.id] = false;
      });

      setWriteAccessDisabled(initialWriteAccessDisabled);
    } catch (error) {
      setError(`Error fetching privileged users: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchPrivilegedUsers();
  }, [category_id]);

  useEffect(() => {
    fetchUsers();
  }, [privilegedUsers]);

  const grantUserReadAccess = async (userId) => {
    try {
      await axiosInstance.put(
        `/users/${userId}/permissions/${category_id}/read`
      );
      const user = users.find((user) => user.id === userId);
      setPrivilegedUsers((prevUsers) => [...prevUsers, user]);
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
    } catch (error) {
      setError(`Error granting access: ${error.message}`);
    }
  };

  const grantUserWriteAccess = async (userId) => {
    try {
      await axiosInstance.put(
        `/users/${userId}/permissions/${category_id}/write`
      );
      setWriteAccessDisabled((prev) => ({ ...prev, [userId]: true }));
    } catch (error) {
      setError(`Error granting access: ${error.message}`);
    }
  };

  const revokeAccess = async (userId) => {
    try {
      await axiosInstance.delete(`/users/${userId}/permissions/${category_id}`);
      setPrivilegedUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );

      const revokedUser = privilegedUsers.find((user) => user.id === userId);
      setUsers((prevUsers) => [...prevUsers, revokedUser]);
      setWriteAccessDisabled((prev) => ({ ...prev, [userId]: false }));
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
    <div className="admin-view-container">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div className="search-bar-users">
            <SearchAutocomplete
              options={users}
              label="Add user"
              getOptionLabel={(option) => option.username}
              onOptionSelect={(option) => grantUserReadAccess(option.id)}
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
                      <span className="span-text">Read access</span>
                      <Checkbox
                        disabled
                        checked
                        sx={{
                          color: "#197769e0",
                          "&.Mui-checked": {
                            color: "#197769e0",
                          },
                        }}
                      />
                      <span className="span-text">Write access</span>
                      <Checkbox
                        checked={writeAccessDisabled[user.id]}
                        disabled={writeAccessDisabled[user.id]}
                        onChange={() => grantUserWriteAccess(user.id)}
                        sx={{
                          color: "#197769e0",
                          "&.Mui-checked": {
                            color: "#197769e0",
                          },
                        }}
                      />
                      <button
                        className="remove-button"
                        onClick={() => revokeAccess(user.id)}
                      >
                        <span className="remove-button-span">
                          Revoke access
                        </span>
                      </button>
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
