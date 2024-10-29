import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Topics from "./components/Home";
import Categories from "./components/Categories";
import CategoryDetail from "./components/CategoryDetail";
import Login from "./components/login";
import TopicDetail from "./components/TopicDetail";
import "./App.css";
import Register from "./components/Register";
import HomeElement from "./components/Home";

const App = () => {
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        {/* <Sidebar /> */}
        <Routes>
          <Route path="/" element={<HomeElement />} exact />
          <Route path="/topics/public" element={<HomeElement />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/category/:id" element={<CategoryDetail />} />
          <Route path="/topic/:id" element={<TopicDetail />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
