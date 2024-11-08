import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import React, { useEffect } from "react";
import Header from "./components/header/Header";
import CategoryAccess from "./components/category/CategoryAcess";
import TopicsForUser from "./components/topics/TopicsForUser";
import Categories from "./components/category/Categories";
import CategoryDetail from "./components/category/CategoryDetail";
import CreateTopic from "./components/topics/CreateTopic";
import CreateCategory from "./components/category/CreateCategory";
import Login from "./components/auth/Login";
import TopicDetail from "./components/topics/TopicDetail";
import CreateMessage from "./components/message/CreateMessage";
import "./styles/App.css";
import Register from "./components/auth/Register";
import ConversationView from "./components/message/ConversationView";
import PublicTopics from "./components/topics/PublicTopics";
import { isAuthenticated } from "./service/auth";

const App = () => {
  return (
    <div className="app-container">
      <Header />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<HomeElement />} exact />
          <Route path="/topics" element={<HomeElement />} />
          <Route path="/conversations" element={<ProtectedConversationView />} />
          <Route path="/conversations/new" element={<ProtectedCreateMessage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/login" element={<ProtectedLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/category/create" element={<CreateCategory />} />
          <Route path="/category/:category_id" element={<CategoryDetail />} />
          <Route path="/topic/:topic_id" element={<TopicDetail />} />
          <Route
            path="/category/:category_id/access"
            element={<CategoryAccess />}
          />
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

const ProtectedTopicCreate = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return isAuthenticated() ? <CreateTopic /> : null;
};

const ProtectedConversationView = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);
  
  return isAuthenticated() ? <ConversationView /> : null;
} 

const ProtectedCreateMessage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);
  
  return isAuthenticated() ? <CreateMessage /> : null;
}

export default App;