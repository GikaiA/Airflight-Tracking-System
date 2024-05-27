import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Homepage/Homepage";
import Login from "./Login/Login";
import Dashboard from "./Dashboard/Dashboard";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import AccessForbidden from "./AccessForbidden/AccessForbidden";
import Register from "./Register/Register";
import Search from "./Search/Search";
import FindPilot from "./FindPilot/FindPilot";
import About from "./About/About";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About/>}/>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit-profile/:id" element={<EditProfile />} />
          <Route path="/findapilot" element={<FindPilot />} />
          <Route path="/search" element={<Search />} />
          <Route path="/accessforbidden" element={<AccessForbidden />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
