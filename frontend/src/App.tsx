import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import JoinRoom from "./pages/JoinRoom";
import Editor from "./pages/Editor";
import Help from "./pages/Help";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile"; 
import History from "./pages/History";

function App() {
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
      </Routes>
    </Router>
  );
}

export default App;
