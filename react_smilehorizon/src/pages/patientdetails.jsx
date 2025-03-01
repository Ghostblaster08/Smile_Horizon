import React, { useState, useEffect } from "react";
import './patientdetails.css'; // Create a new CSS file for patient details

const PatientDetails = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescription, setPrescription] = useState("");
  const [workDone, setWorkDone] = useState("");
  const [pendingWork, setPendingWork] = useState("");
  const [postMedication, setPostMedication] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [teethStatus, setTeethStatus] = useState(Array(32).fill(""));
  const [selectedTooth, setSelectedTooth] = useState(null); // Track selected tooth

  const handleToothClick = (index) => {
    setSelectedTooth(index);
  };

  const handleStatusChange = (status) => {
    const updatedTeethStatus = [...teethStatus];
    updatedTeethStatus[selectedTooth] = status;
    setTeethStatus(updatedTeethStatus);
  };

  // Sample Patient Data
  const patients = [
    { name: "John Doe", age: 32, gender: "Male", contact: "1234567890", email: "john@example.com", bloodGroup: "O+", allergies: "None", condition: "Healthy", occupation: "Engineer" },
    { name: "Jane Smith", age: 28, gender: "Female", contact: "9876543210", email: "jane@example.com", bloodGroup: "A+", allergies: "Penicillin", condition: "Mild infection", occupation: "Teacher" }
  ];

  useEffect(() => {
    if (searchTerm) {
      const filteredPatients = patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSelectedPatient(filteredPatients[0]);
    } else {
      setSelectedPatient(null);
    }
  }, [searchTerm, patients]);

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
            <p>Blood Group: {selectedPatient.bloodGroup}</p>
            <p>Allergies: {selectedPatient.allergies}</p>
            <p>Condition: {selectedPatient.condition}</p>
            <p>Occupation: {selectedPatient.occupation}</p>
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
                  <img src={`/teeth/${status || 'normal'}.svg`} alt={`Tooth ${index + 1}`} />
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
                  <img src={`/teeth/${status || 'normal'}.svg`} alt={`Tooth ${index + 17}`} />
                </div>
              ))}
            </div>
          </div>
          {selectedTooth !== null && (
            <div className="treatment-section">
              <div className="treatment-box">
                <label htmlFor="status">Status</label>
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
        </div>
      )}
    </div>
  );
};

export default PatientDetails;