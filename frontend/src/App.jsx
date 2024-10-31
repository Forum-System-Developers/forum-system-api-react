import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import React, { useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Topics from "./components/Topics";
import Categories from "./components/Categories";
import CategoryDetail from "./components/CategoryDetail";
import CreateTopic from "./components/CreateTopic";
import Login from "./components/login";
import TopicDetail from "./components/TopicDetail";
import "./App.css";
import Register from "./components/Register";
import HomeElement from "./components/Home";
import { isAuthenticated } from "./service/auth";

const App = () => {
  return (
    <div className="app-container">
      <Header />
      <div className="app-content">
        {/* <Sidebar /> */}
        <Routes>
          <Route path="/" element={<HomeElement />} exact />
          <Route path="/topics" element={<ConditionalTopics />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/login" element={<ProtectedLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/category/:category_id" element={<CategoryDetail />} />
          <Route path="/topic/:topic_id" element={<TopicDetail />} />
          <Route
            path="/category/:category_id/topics/new"
            element={<CreateTopic />}
          />
        </Routes>
      </div>
    </div>
  );
};

const ProtectedLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return !isAuthenticated() ? <Login /> : null;
};

const ConditionalTopics = () => {
  return !isAuthenticated() ? <HomeElement /> : <Topics />;
};

export default App;
