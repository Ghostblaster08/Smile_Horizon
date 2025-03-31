import React, { useState, useEffect } from "react";
import axios from "axios";
import "./appointments.css"; // Ensure this CSS file styles your component

const API_URL = "http://localhost:8000/appointments/"; // Adjust this if needed

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newAppointment, setNewAppointment] = useState({
    patient: "",
    appointment_date: "",
    appointment_time: "",
    purpose: "",
  });

  // Fetch appointments from Django backend
  useEffect(() => {
    axios
      .get(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // If using authentication
      })
      .then((response) => setAppointments(response.data))
      .catch((error) => console.error("Error fetching appointments:", error));
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment({ ...newAppointment, [name]: value });
  };

  // Add appointment to the backend
  const handleAddAppointment = (e) => {
    e.preventDefault();

    if (!newAppointment.patient || !newAppointment.appointment_date || !newAppointment.appointment_time || !newAppointment.purpose) {
      alert("Please fill all fields.");
      return;
    }

    axios
      .post(API_URL, newAppointment, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setAppointments([...appointments, response.data]);
        setNewAppointment({ patient: "", appointment_date: "", appointment_time: "", purpose: "" });
      })
      .catch((error) => console.error("Error adding appointment:", error));
  };

  // Delete appointment from the backend
  const handleDelete = (id) => {
    axios
      .delete(`${API_URL}${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => setAppointments(appointments.filter((appt) => appt.id !== id)))
      .catch((error) => console.error("Error deleting appointment:", error));
  };

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter((appt) =>
    appt.patient.first_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          name="patient"
          placeholder="Patient ID"
          value={newAppointment.patient}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="appointment_date"
          value={newAppointment.appointment_date}
          onChange={handleInputChange}
        />
        <input
          type="time"
          name="appointment_time"
          value={newAppointment.appointment_time}
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
                <strong>{appt.patient.first_name} {appt.patient.last_name}</strong> — {appt.appointment_date} at {appt.appointment_time}  
                <br />
                Purpose: {appt.purpose}
              </div>
              <button onClick={() => handleDelete(appt.id)} className="delete-btn">
                Delete
              </button>
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
