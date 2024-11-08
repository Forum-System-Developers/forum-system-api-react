import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./styles/index.css";
import App from "./App.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary";

const root = createRoot(document.getElementById("root"));

root.render(
  <Router>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </Router>
);
