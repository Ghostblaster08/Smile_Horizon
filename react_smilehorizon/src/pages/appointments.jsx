import React, { useState, useEffect } from "react";
import axios from "axios";
import "./appointments.css"; // Styles for your form

const API_URL = "http://localhost:8000/appointments/api/appointments/";

const Appointments = () => {
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
    axios
      .delete(`${API_URL}${id}/`)
      .then(() => setAppointments(appointments.filter((appt) => appt.id !== id)))
      .catch((error) => console.error("Error deleting appointment:", error));
  };

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
                <strong>{appt.patient.first_name} {appt.patient.last_name}</strong> — {appt.appointment_date} at {appt.appointment_time}
                <br />
                Purpose: {appt.reason}
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
