import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidenav from "./components/Sidenav";
import Dashboard from "./pages/Dashboard";
import CityDetail from "./pages/CityDetail";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app-layout">
        <Sidenav />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/city/:cityName" element={<CityDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
