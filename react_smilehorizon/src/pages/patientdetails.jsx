import React, { useState, useEffect } from "react";
import axios from "axios";
import "./patientdetails.css"; // Ensure this CSS file is properly linked

const API_URL = "http://localhost:8000/patients/"; // Adjust based on your Django API

const PatientDetails = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [prescription, setPrescription] = useState("");
  const [workDone, setWorkDone] = useState("");
  const [pendingWork, setPendingWork] = useState("");
  const [postMedication, setPostMedication] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [teethStatus, setTeethStatus] = useState(Array(32).fill(""));
  const [selectedTooth, setSelectedTooth] = useState(null);

  // Fetch patients from the backend
  useEffect(() => {
    axios
      .get(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => setPatients(response.data))
      .catch((error) => console.error("Error fetching patients:", error));
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm) {
      const filteredPatient = patients.find((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSelectedPatient(filteredPatient || null);
      if (filteredPatient) {
        setTeethStatus(filteredPatient.teeth_status || Array(32).fill(""));
        setPrescription(filteredPatient.prescription || "");
        setWorkDone(filteredPatient.work_done || "");
        setPendingWork(filteredPatient.pending_work || "");
        setPostMedication(filteredPatient.post_medication || "");
        setCurrentMedications(filteredPatient.current_medications || "");
      }
    } else {
      setSelectedPatient(null);
    }
  }, [searchTerm, patients]);

  const handleToothClick = (index) => {
    setSelectedTooth(index);
  };

  const handleStatusChange = (status) => {
    const updatedTeethStatus = [...teethStatus];
    updatedTeethStatus[selectedTooth] = status;
    setTeethStatus(updatedTeethStatus);
  };

  // Save patient data to the backend
  const handleSaveDetails = () => {
    if (!selectedPatient) return;

    const updatedData = {
      teeth_status: teethStatus,
      prescription,
      work_done: workDone,
      pending_work: pendingWork,
      post_medication: postMedication,
      current_medications: currentMedications,
    };

    axios
      .put(`${API_URL}${selectedPatient.id}/`, updatedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => alert("Patient details updated successfully!"))
      .catch((error) => console.error("Error updating patient details:", error));
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
            <p>Name: {selectedPatient.name}</p>
            <p>Age: {selectedPatient.age}</p>
            <p>Gender: {selectedPatient.gender}</p>
            <p>Contact: {selectedPatient.contact}</p>
            <p>Email: {selectedPatient.email}</p>
            <p>Blood Group: {selectedPatient.blood_group}</p>
            <p>Allergies: {selectedPatient.allergies}</p>
            <p>Condition: {selectedPatient.condition}</p>
            <p>Occupation: {selectedPatient.occupation}</p>
          </div>

          {/* Dental Chart */}
          <div className="dental-chart">
            <h2>Dental Chart</h2>
            <div className="dental-row">
              {teethStatus.slice(0, 16).map((status, index) => (
                <div
                  key={index}
                  className={`tooth ${status}`}
                  onClick={() => handleToothClick(index)}
                >

                  <img src={`/teeth/${status || "normal"}.svg`} alt={`Tooth ${index + 1}`} />
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

                  <img src={`/teeth/${status || "normal"}.svg`} alt={`Tooth ${index + 17}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Status Update for Selected Tooth */}
          {selectedTooth !== null && (
            <div className="treatment-section">
              <div className="treatment-box">
                <label htmlFor="status">Tooth Status</label>
                <select
                  id="status"
                  value={teethStatus[selectedTooth]}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="filling">Filling</option>
                  <option value="extraction">Extraction</option>
                  <option value="missing">Missing</option>
                </select>
              </div>
            </div>
          )}

          {/* Work Done Section */}
          <div className="work-done">
            <h2>Work Done</h2>
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
              placeholder="What has to be done"
            />
          </div>

          {/* Medical History Section */}
          <div className="medical-history">
            <h2>Medical History and Past Treatments</h2>
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

          {/* Save Button */}
          <button onClick={handleSaveDetails} className="save-btn">
            Save Details
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;
