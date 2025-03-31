import React, { useState } from "react";
import './patientlist.css'; // Import the new CSS file

const PatientList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([
    { id: 1, name: "John Doe", age: 32, contact: "1234567890" },
    { id: 2, name: "Jane Smith", age: 28, contact: "9876543210" },
    { id: 3, name: "Alice Johnson", age: 45, contact: "4567890123" },
  ]);
  const [newPatient, setNewPatient] = useState({ name: "", age: "", contact: "" });
  const [editingPatient, setEditingPatient] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient({ ...newPatient, [name]: value });
  };

  const handleAddPatient = (e) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.age || !newPatient.contact) {
      alert("Please fill all fields.");
      return;
    }

    setPatients([...patients, { id: Date.now(), ...newPatient }]);
    setNewPatient({ name: "", age: "", contact: "" });
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setNewPatient(patient);
  };

  const handleUpdatePatient = (e) => {
    e.preventDefault();
    setPatients(patients.map((patient) => (patient.id === editingPatient.id ? newPatient : patient)));
    setEditingPatient(null);
    setNewPatient({ name: "", age: "", contact: "" });
  };

  const handleDeletePatient = (id) => {
    setPatients(patients.filter((patient) => patient.id !== id));
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        <input
          type="text"
          name="name"
          placeholder="Patient Name"
          value={newPatient.name}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={newPatient.age}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact"
          value={newPatient.contact}
          onChange={handleInputChange}
        />
        <button type="submit">{editingPatient ? "Update Patient" : "Add Patient"}</button>
      </form>

      {/* Patient List */}
      <table className="patient-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.length ? (
            filteredPatients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.contact}</td>
                <td>
                  <button onClick={() => handleEditPatient(patient)} className="edit-btn">
                    Edit
                  </button>
                  <button onClick={() => handleDeletePatient(patient.id)} className="delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No patients found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;