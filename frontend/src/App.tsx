import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HomePage from "./pages/HomePage"; 
import JoinRoom from "./pages/JoinRoom";
import Editor from "./pages/Editor";
import Help from "./pages/Help";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import History from "./pages/History";
import { useTheme } from "./context/ThemeContext";
import { DataProvider } from "./context/DataContext"; 

// import NewProject from "./pages/NewProject";
// import ExistingProjects from "./pages/ExistingProjects";

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.className = ""; 
    document.body.classList.add(`theme-${theme}`); 
  }, [theme]);

  return (
    <DataProvider> 
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
    </DataProvider>
  );
}

export default App;
