import React from "react";

const PaginationOptions = ({
  order,
  setOrder,
  orderBy,
  setOrderBy,
  setCurrentPage,
}) => {
  const handleOrderChange = (event) => {
    setOrder(event.target.value);
    setCurrentPage(1);
  };

  const handleOrderByChange = (event) => {
    setOrderBy(event.target.value);
    setCurrentPage(1);
  };

  return (
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
  );
};

export default PaginationOptions;
