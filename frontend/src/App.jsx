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
import TopicsForUser from "./components/TopicsForUser";
import Categories from "./components/Categories";
import CategoryDetail from "./components/CategoryDetail";
import CreateTopic from "./components/CreateTopic";
import CreateCategory from "./components/CreateCategory";
import Login from "./components/login";
import TopicDetail from "./components/TopicDetail";
import "./App.css";
import Register from "./components/Register";
import PublicTopics from "./components/PublicTopics";
import { isAuthenticated } from "./service/auth";

const App = () => {
  return (
    <div className="app-container">
      <Header />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<HomeElement />} exact />
          <Route path="/topics" element={<HomeElement />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/login" element={<ProtectedLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/category/create" element={<CreateCategory />} />
          <Route path="/category/:category_id" element={<CategoryDetail />} />
          <Route path="/topic/:topic_id" element={<TopicDetail />} />
          <Route
            path="/category/:category_id/topics/new"
            element={<ProtectedTopicCreate />}
          />
        </Routes>
      </div>
    </div>
  );
};

const ProtectedLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return !isAuthenticated() ? <Login /> : null;
};

const HomeElement = () => {
  return !isAuthenticated() ? <PublicTopics /> : <TopicsForUser />;
};

export default App;

const ProtectedTopicCreate = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return isAuthenticated() ? <CreateTopic /> : null;
};
