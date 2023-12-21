// App.js
import React from "react";
import Login from "./components/Login.js";
import MainChat from "./components/MainChat.js";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/main" element={<MainChat />} />
      </Routes>
    </Router>
  );
}

export default App;
