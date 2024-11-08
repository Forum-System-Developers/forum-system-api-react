import React, { useEffect, useState } from "react";
import axios from "axios";
import TopicList from "./TopicsList";
import "../../styles/topics.css";

const PublicTopics = () => {
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("created_at");
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  const fetchTopics = async (page = 1) => {
    try {
      const offset = (page - 1) * limit;
      const response = await axios.get(
        "http://localhost:8000/api/v1/topics/public",
        {
          params: {
            order,
            order_by: orderBy,
            limit,
            offset,
          },
        }
      );
      const fetchedTopics = response.data;
      setTopics(fetchedTopics);
      setHasMore(fetchedTopics.length === limit);
    } catch (error) {
      setError(`Error fetching topics: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleOrderChange = (event) => {
    setOrder(event.target.value);
    setCurrentPage(1);
  };

  const handleOrderByChange = (event) => {
    setOrderBy(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="home-container">
      {/* {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      )} */}
      <div className="category-header">
        <h2 className="description">Latest posts</h2>
      </div>

      <div className="content-topics-sidebar">
        <div className="sidebar">
          <label className="order-by">Order By:</label>
          <label className="order-label">
            <select value={orderBy} onChange={handleOrderByChange}>
              <option value="title">Title</option>
              <option value="created_at">Created At</option>
            </select>
          </label>
          <label className="order-label">
            <select value={order} onChange={handleOrderChange}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>
        <TopicList topics={topics} />
      </div>

      <div className="pagination-controls">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={!hasMore}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PublicTopics;
