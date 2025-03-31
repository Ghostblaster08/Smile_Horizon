import React, { useState, useEffect } from "react";
import axios from "axios";
import "./patientlist.css";

const PatientList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({
    first_name: "",
    last_name: "",
    age: "",
    gender: "M",
    contact_number: "",
    email: "",
    address: "",
    blood_group: "",
    allergies: "",
    existing_conditions: "",
    status: "NEW",
  });
  const [editingPatient, setEditingPatient] = useState(null);

  const API_URL = "http://127.0.0.1:8000/api/patients/"; // Update this if needed
  // Fetch patients from backend
  useEffect(() => {
    axios
      .get(API_URL, { headers })
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.error("Error fetching patients:", error);
      });
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient({ ...newPatient, [name]: value });
  };

  // Add a new patient
  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL, newPatient, { headers });
      setPatients([...patients, response.data]);
      setNewPatient({
        first_name: "",
        last_name: "",
        age: "",
        gender: "M",
        contact_number: "",
        email: "",
        address: "",
        blood_group: "",
        allergies: "",
        existing_conditions: "",
        status: "NEW",
      });
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  // Edit patient (populate form)
  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setNewPatient(patient);
  };

  // Update patient
  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}${editingPatient.id}/`, newPatient, { headers });
      setPatients(patients.map((p) => (p.id === editingPatient.id ? newPatient : p)));
      setEditingPatient(null);
      setNewPatient({
        first_name: "",
        last_name: "",
        age: "",
        gender: "M",
        contact_number: "",
        email: "",
        address: "",
        blood_group: "",
        allergies: "",
        existing_conditions: "",
        status: "NEW",
      });
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  };

  // Delete patient
  const handleDeletePatient = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`, { headers });
      setPatients(patients.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  // Filter patients based on search term
  const filteredPatients = patients.filter(
    (patient) =>
      patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.contact_number.includes(searchTerm)
  );

  return (
    <div className="patient-list-page">
      <h1>Patient List</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by patient name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      {/* Patient Form */}
      <form onSubmit={editingPatient ? handleUpdatePatient : handleAddPatient} className="patient-form">
        <input type="text" name="first_name" placeholder="First Name" value={newPatient.first_name} onChange={handleInputChange} required />
        <input type="text" name="last_name" placeholder="Last Name" value={newPatient.last_name} onChange={handleInputChange} required />
        <input type="number" name="age" placeholder="Age" value={newPatient.age} onChange={handleInputChange} required />
        <select name="gender" value={newPatient.gender} onChange={handleInputChange} required>
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="O">Other</option>
        </select>
        <input type="text" name="contact_number" placeholder="Contact" value={newPatient.contact_number} onChange={handleInputChange} required />
        <input type="email" name="email" placeholder="Email" value={newPatient.email} onChange={handleInputChange} />
        <input type="text" name="blood_group" placeholder="Blood Group" value={newPatient.blood_group} onChange={handleInputChange} />
        <input type="text" name="address" placeholder="Address" value={newPatient.address} onChange={handleInputChange} />
        <textarea name="allergies" placeholder="Allergies" value={newPatient.allergies} onChange={handleInputChange} />
        <textarea name="existing_conditions" placeholder="Existing Conditions" value={newPatient.existing_conditions} onChange={handleInputChange} />
        <select name="status" value={newPatient.status} onChange={handleInputChange} required>
          <option value="NEW">New Patient</option>
          <option value="ONGOING">Ongoing Treatment</option>
          <option value="COMPLETED">Treatment Completed</option>
          <option value="FOLLOW_UP">Follow-up Required</option>
        </select>
        <button type="submit">{editingPatient ? "Update Patient" : "Add Patient"}</button>
      </form>

      {/* Patient List */}
      <table className="patient-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.length ? (
            filteredPatients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.first_name} {patient.last_name}</td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>{patient.contact_number}</td>
                <td>{patient.email}</td>
                <td>{patient.status}</td>
                <td>
                  <button onClick={() => handleEditPatient(patient)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDeletePatient(patient.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No patients found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;
