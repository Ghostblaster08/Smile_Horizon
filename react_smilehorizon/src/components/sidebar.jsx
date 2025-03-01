import React from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';

function Sidebar() {
  return (
    <nav className="sidebar">
      <ul>
        <li><Link to="/">Home</Link></li> {/* Add Home link */}
        <li><Link to="/patientlist">Patient List</Link></li>
        <li><Link to="/patientdetails">Patient Details</Link></li>
        <li><Link to="/appointments">Appointments</Link></li>
      </ul>
    </nav>
  );
}

export default Sidebar;
