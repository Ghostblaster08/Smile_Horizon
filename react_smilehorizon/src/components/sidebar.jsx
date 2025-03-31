import React from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";

function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-content">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/patientlist">Patient List</Link>
          </li>
          <li>
            <Link to="/patientdetails">Patient Details</Link>
          </li>
          <li>
            <Link to="/appointments">Appointments</Link>
          </li>
        </ul>
      </div>

      <div className="copyright">© 2025 Smile Horizon</div>
    </nav>
  );
}

export default Sidebar;
