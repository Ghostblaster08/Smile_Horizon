import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import './appointments.css'; // Create a new CSS file for appointments
const API_URL = "http://localhost:8000/appointments/api/appointments/";

const Appointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    patient_name: "", // Use name instead of ID
    appointment_date: "",
    appointment_time: "",
    reason: "",
  });

  // Fetch appointments from the backend
  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        // Ensure the patient data is populated correctly
        console.log("Appointments API Response:", response.data);
        setAppointments(response.data);
      })
      .catch((error) => console.error("Error fetching appointments:", error));
  }, []);

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment({ ...newAppointment, [name]: value });
  };

  // Add new appointment
  const handleAddAppointment = (e) => {
    e.preventDefault();

    axios
      .post(API_URL, newAppointment)
      .then((response) => {
        setAppointments([...appointments, response.data]);
        setNewAppointment({
          patient_name: "",
          appointment_date: "",
          appointment_time: "",
          reason: "",
        });
        alert("Appointment added successfully!");
      })
      .catch((error) => {
        alert("Failed to add appointment. Check console for errors.");
        console.error("Error:", error.response.data);
      });
  };

  // Delete an appointment
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

      {/* Appointment Form */}
      <form onSubmit={handleAddAppointment} className="appointment-form">
        <input
          type="text"
          name="patient_name"
          placeholder="Enter Patient Name (e.g., John Doe)"
          value={newAppointment.patient_name}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="appointment_date"
          value={newAppointment.appointment_date}
          onChange={handleInputChange}
          required
        />
        <input
          type="time"
          name="appointment_time"
          value={newAppointment.appointment_time}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="reason"
          placeholder="Purpose of Appointment"
          value={newAppointment.reason}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Appointment</button>
      </form>

      {/* Appointment List */}
      <ul className="appointment-list">
        {appointments.length ? (
          appointments.map((appt) => (
            <li key={appt.id} className="appointment-item">
              <div>
                <button 
                  className="patient-name-button" 
                  onClick={() => handleAppointmentClick(appt.id)}
                >
                  {appt.patient.first_name} {appt.patient.last_name}
                </button> — {appt.appointment_date} at {appt.appointment_time}
                <br />
                Purpose: {appt.reason}
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
