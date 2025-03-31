import React, { useState, useEffect } from "react";
import axios from "axios";
import "./patientdetails.css"; // Create or modify patientdetails.css as needed

const API_URL = "http://localhost:8000/api/patients/"; // Update with your backend URL

const PatientDetails = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [teethStatus, setTeethStatus] = useState(Array(32).fill("normal"));
  const [selectedTooth, setSelectedTooth] = useState(null);

  const [prescription, setPrescription] = useState("");
  const [workDone, setWorkDone] = useState("");
  const [pendingWork, setPendingWork] = useState("");
  const [postMedication, setPostMedication] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");

  // Fetch patients from API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(API_URL);
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  // Fetch selected patient's details and teeth status
  useEffect(() => {
    if (searchTerm) {
      const filteredPatients = patients.filter((patient) =>
        patient.first_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredPatients.length > 0) {
        setSelectedPatient(filteredPatients[0]);
        fetchTeethStatus(filteredPatients[0].id);
      } else {
        setSelectedPatient(null);
      }
    } else {
      setSelectedPatient(null);
    }
  }, [searchTerm, patients]);

  // Fetch teeth status dynamically from API
  const fetchTeethStatus = async (patientId) => {
    try {
      const response = await axios.get(`${API_URL}${patientId}/teeth-status/`);
      const teethData = Array(32).fill("normal");

      response.data.forEach((tooth) => {
        teethData[tooth.tooth_number - 1] = tooth.status;
      });
      setTeethStatus(teethData);
    } catch (error) {
      console.error("Error fetching teeth status:", error);
    }
  };

  // Handle tooth selection and status update
  const handleToothClick = (index) => {
    setSelectedTooth(index);
  };

  const handleStatusChange = async (status) => {
    const updatedTeethStatus = [...teethStatus];
    updatedTeethStatus[selectedTooth] = status;
    setTeethStatus(updatedTeethStatus);

    if (selectedPatient) {
      try {
        await axios.post(`${API_URL}${selectedPatient.id}/update-teeth/`, {
          tooth_number: selectedTooth + 1,
          status: status,
        });
      } catch (error) {
        console.error("Error updating tooth status:", error);
      }
    }
  };

  // Handle submission of work and medications
  const handleSubmit = async () => {
    if (!selectedPatient) {
      alert("Please select a patient first!");
      return;
    }

    try {
      await axios.post(`${API_URL}${selectedPatient.id}/update-details/`, {
        prescription,
        work_done: workDone,
        pending_work: pendingWork,
        post_medication: postMedication,
        current_medications: currentMedications,
      });

      alert("Patient details updated successfully!");
    } catch (error) {
      console.error("Error updating details:", error);
      alert("Failed to update patient details.");
    }
  };

  return (
    <div className="patient-details-page">
      <div className="search-panel">
        <input
          type="text"
          placeholder="Search patient..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {selectedPatient && (
        <div className="patient-details">
          <div className="personal-info">
            <h2>Personal Information</h2>
            <p>Name: {selectedPatient.first_name} {selectedPatient.last_name}</p>
            <p>Age: {selectedPatient.age}</p>
            <p>Gender: {selectedPatient.gender}</p>
            <p>Contact: {selectedPatient.contact_number}</p>
            <p>Email: {selectedPatient.email}</p>
            <p>Blood Group: {selectedPatient.blood_group}</p>
            <p>Allergies: {selectedPatient.allergies || "None"}</p>
            <p>Conditions: {selectedPatient.existing_conditions || "Healthy"}</p>
          </div>

          <div className="dental-chart">
            <h2>Dental Chart</h2>
            <div className="dental-row">
              {teethStatus.slice(0, 16).map((status, index) => (
                <div
                  key={index}
                  className={`tooth ${status}`}
                  onClick={() => handleToothClick(index)}
                >
                  <img
                    src={`/teeth/${status || "normal"}.svg`}
                    alt={`Tooth ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <div className="dental-row">
              {teethStatus.slice(16).map((status, index) => (
                <div
                  key={index + 16}
                  className={`tooth ${status}`}
                  onClick={() => handleToothClick(index + 16)}
                >
                  <img
                    src={`/teeth/${status || "normal"}.svg`}
                    alt={`Tooth ${index + 17}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {selectedTooth !== null && (
            <div className="treatment-section">
              <div className="treatment-box">
                <label htmlFor="status">Tooth Status:</label>
                <select
                  id="status"
                  value={teethStatus[selectedTooth]}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="normal">Normal</option>
                  <option value="filling">Filling</option>
                  <option value="extraction">Extraction</option>
                  <option value="missing">Missing</option>
                </select>
              </div>
            </div>
          )}

          <div className="work-done">
            <h2>Work Done & Medications</h2>
            <textarea
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              placeholder="Prescription"
            />
            <textarea
              value={workDone}
              onChange={(e) => setWorkDone(e.target.value)}
              placeholder="What is done"
            />
            <textarea
              value={pendingWork}
              onChange={(e) => setPendingWork(e.target.value)}
              placeholder="What needs to be done"
            />
          </div>

          <div className="medical-history">
            <h2>Medical History & Current Medications</h2>
            <textarea
              value={postMedication}
              onChange={(e) => setPostMedication(e.target.value)}
              placeholder="Post Medication"
            />
            <textarea
              value={currentMedications}
              onChange={(e) => setCurrentMedications(e.target.value)}
              placeholder="Current Medications"
            />
          </div>

          <button onClick={handleSubmit} className="submit-btn">
            Save Details
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;
