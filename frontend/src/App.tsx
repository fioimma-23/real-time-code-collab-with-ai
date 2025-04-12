import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HomePage from "./pages/HomePage"; // New HomePage with sidebar
import JoinRoom from "./pages/JoinRoom";
import Editor from "./pages/Editor";
import Help from "./pages/Help";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import History from "./pages/History";
import { useTheme } from "./context/ThemeContext";

// // These will be created or stubbed if not yet built
// import NewProject from "./pages/NewProject";
// import ExistingProjects from "./pages/ExistingProjects";

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.className = ""; // Clear old classes
    document.body.classList.add(`theme-${theme}`); // Apply current theme
  }, [theme]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/editor/:roomId" element={<Editor />} />
        <Route path="/help" element={<Help />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<History />} />
        <Route path="/home" element={<HomePage />} />
        {/* <Route path="/new-project" element={<NewProject />} />
        <Route path="/projects" element={<ExistingProjects />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
