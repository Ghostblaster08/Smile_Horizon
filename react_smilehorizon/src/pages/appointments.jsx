import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './appointments.css';

const Appointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([
    { id: 1, patientName: "John Doe", date: "2025-03-01", time: "10:00 AM", purpose: "Routine Checkup" },
    { id: 2, patientName: "Jane Smith", date: "2025-03-02", time: "02:30 PM", purpose: "Filling" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    date: "",
    time: "",
    purpose: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment({ ...newAppointment, [name]: value });
  };

  const handleAddAppointment = (e) => {
    e.preventDefault();
    if (!newAppointment.patientName || !newAppointment.date || !newAppointment.time || !newAppointment.purpose) {
      alert("Please fill all fields.");
      return;
    }

    setAppointments([
      ...appointments,
      { id: Date.now(), ...newAppointment },
    ]);
    setNewAppointment({ patientName: "", date: "", time: "", purpose: "" });
  };

  const handleDelete = (id) => {
    const updatedAppointments = appointments.filter((appt) => appt.id !== id);
    setAppointments(updatedAppointments);
  };

  const handleAppointmentClick = (id) => {
    console.log(`Navigating to appointment ${id}`);
    // Use the exact same path as defined in App.js
    navigate(`/appointment/${id}`);
  };

  const filteredAppointments = appointments.filter((appt) =>
    appt.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    console.log("Navigate function available:", !!navigate);
  }, [navigate]);

  return (
    <div className="appointments-page">
      <h1>Appointments</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by patient name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      {/* Appointment Form */}
      <form onSubmit={handleAddAppointment} className="appointment-form">
        <input
          type="text"
          name="patientName"
          placeholder="Patient Name"
          value={newAppointment.patientName}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="date"
          value={newAppointment.date}
          onChange={handleInputChange}
        />
        <input
          type="time"
          name="time"
          value={newAppointment.time}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="purpose"
          placeholder="Purpose"
          value={newAppointment.purpose}
          onChange={handleInputChange}
        />
        <button type="submit">Add Appointment</button>
      </form>

      {/* Appointment List */}
      <ul className="appointment-list">
        {filteredAppointments.length ? (
          filteredAppointments.map((appt) => (
            <li key={appt.id} className="appointment-item">
              <div>
                <button 
                  className="patient-name-button" 
                  onClick={() => handleAppointmentClick(appt.id)}
                >
                  {appt.patientName}
                </button> — {appt.date} at {appt.time}  
                <br />
                Purpose: {appt.purpose}
              </div>
              <div className="appointment-actions">
                <button 
                  onClick={() => handleAppointmentClick(appt.id)} 
                  className="view-btn"
                >
                  View Details
                </button>
                <button 
                  onClick={() => handleDelete(appt.id)} 
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <li>No appointments found.</li>
        )}
      </ul>
    </div>
  );
};

export default Appointments;