import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import PatientList from './pages/patientlist';
import PatientDetails from './pages/patientdetails';
import Appointments from './pages/appointments';
import Home from './pages/home';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <Sidebar />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/patientlist" element={<PatientList />} />
              <Route path="/patientdetails" element={<PatientDetails />} />
              <Route path="/appointments" element={<Appointments />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
