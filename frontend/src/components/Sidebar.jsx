import React from "react";

const categories = ["Category 1", "Category 2", "Category 3"];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h3>Categories</h3>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>{category}</li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
