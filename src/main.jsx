import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./styles/App.css";
import App from "./App.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <Router>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </Router>
);
