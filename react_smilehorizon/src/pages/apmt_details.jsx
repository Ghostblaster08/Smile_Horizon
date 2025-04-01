import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./apmt_details.css";

const AppointmentDetails = () => {
  const { id } = useParams(); // Get the id from the URL
  const navigate = useNavigate();
  
  // Added console log for debugging
  useEffect(() => {
    console.log("Appointment ID from URL:", id);
    // Fetch appointment data using this ID
    // For now, we'll use sample data
  }, [id]);

  // States for appointment and patient information
  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // States for dental work and prescriptions
  const [currentNotes, setCurrentNotes] = useState("");
  const [newPrescription, setNewPrescription] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [workToBeDone, setWorkToBeDone] = useState("");
  
  // Teeth chart state
  const [teethStatus, setTeethStatus] = useState(Array(32).fill(""));
  const [selectedTooth, setSelectedTooth] = useState(null);

  // Sample data (replace with API calls)
  const sampleAppointment = {
    id: "1",
    date: "2025-04-05",
    time: "10:00 AM",
    reason: "Tooth pain",
    status: "SCHEDULED",
    patient_id: "101"
  };
  
  const samplePatient = {
    id: "101",
    name: "John Doe",
    age: 32,
    gender: "Male",
    contact: "1234567890",
    email: "john@example.com",
    bloodGroup: "O+",
    allergies: "None",
    medicalHistory: [
      { date: "2025-03-10", diagnosis: "Cavity in molar", treatment: "Filling" },
      { date: "2024-11-15", diagnosis: "Gum inflammation", treatment: "Scaling" }
    ],
    previousPrescriptions: [
      { 
        date: "2025-03-10", 
        medicines: [
          { name: "Amoxicillin", dosage: "500mg", frequency: "3 times daily", duration: "7 days" },
          { name: "Ibuprofen", dosage: "400mg", frequency: "As needed for pain", duration: "5 days" }
        ] 
      },
      { 
        date: "2024-11-15", 
        medicines: [
          { name: "Chlorhexidine Mouthwash", dosage: "15ml", frequency: "Twice daily", duration: "10 days" }
        ] 
      }
    ]
  };
  
  // Sample medicine list
  const medicineList = [
    "Amoxicillin", "Ibuprofen", "Paracetamol", "Metronidazole", 
    "Chlorhexidine Mouthwash", "Lidocaine Gel", "Prednisolone", 
    "Acetaminophen", "Codeine", "Doxycycline"
  ];

  // Fetch appointment and patient data
  useEffect(() => {
    // In a real app, replace with API calls
    setTimeout(() => {
      setAppointment(sampleAppointment);
      setPatient(samplePatient);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleToothClick = (index) => {
    setSelectedTooth(index);
  };

  const handleStatusChange = (status) => {
    const updatedTeethStatus = [...teethStatus];
    updatedTeethStatus[selectedTooth] = status;
    setTeethStatus(updatedTeethStatus);
  };

  const handleAddMedicine = () => {
    if (selectedMedicine && dosage && frequency && duration) {
      const newMedicine = {
        name: selectedMedicine,
        dosage,
        frequency,
        duration
      };
      setNewPrescription([...newPrescription, newMedicine]);
      // Reset form
      setSelectedMedicine("");
      setDosage("");
      setFrequency("");
      setDuration("");
    }
  };

  const handleRemoveMedicine = (index) => {
    const updatedPrescription = [...newPrescription];
    updatedPrescription.splice(index, 1);
    setNewPrescription(updatedPrescription);
  };

  const handleSaveAppointment = () => {
    // Here you would save all the data to your backend
    // For now, we'll just show an alert
    alert("Appointment details saved successfully!");
    navigate("/appointments"); // Redirect to appointments list
  };

  if (loading) {
    return <div className="loading">Loading appointment details...</div>;
  }

  return (
    <div className="appointment-details-container">
      <h1>Appointment Details</h1>
      <p>Viewing details for appointment ID: {id}</p>
      <div className="appointment-header">
        <div className="appointment-meta">
          <p><strong>Date:</strong> {appointment.date}</p>
          <p><strong>Time:</strong> {appointment.time}</p>
          <p><strong>Reason:</strong> {appointment.reason}</p>
          <p><strong>Status:</strong> <span className={`status-${appointment.status.toLowerCase()}`}>{appointment.status}</span></p>
        </div>
      </div>

      <div className="patient-card">
        <h2>Patient Information</h2>
        <div className="patient-info">
          <div className="info-column">
            <p><strong>Name:</strong> {patient.name}</p>
            <p><strong>Age:</strong> {patient.age}</p>
            <p><strong>Gender:</strong> {patient.gender}</p>
          </div>
          <div className="info-column">
            <p><strong>Contact:</strong> {patient.contact}</p>
            <p><strong>Email:</strong> {patient.email}</p>
            <p><strong>Blood Group:</strong> {patient.bloodGroup}</p>
          </div>
          <div className="info-column">
            <p><strong>Allergies:</strong> {patient.allergies}</p>
          </div>
        </div>
      </div>

      <div className="previous-treatments">
        <h2>Medical History</h2>
        <div className="history-cards">
          {patient.medicalHistory.map((record, index) => (
            <div key={index} className="history-card">
              <div className="card-header">
                <span className="date">{record.date}</span>
              </div>
              <div className="card-body">
                <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                <p><strong>Treatment:</strong> {record.treatment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="previous-prescriptions">
        <h2>Previous Prescriptions</h2>
        <div className="prescription-cards">
          {patient.previousPrescriptions.map((prescription, index) => (
            <div key={index} className="prescription-card">
              <div className="card-header">
                <span className="date">{prescription.date}</span>
              </div>
              <div className="card-body">
                <table className="medicine-table">
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Dosage</th>
                      <th>Frequency</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescription.medicines.map((medicine, midx) => (
                      <tr key={midx}>
                        <td>{medicine.name}</td>
                        <td>{medicine.dosage}</td>
                        <td>{medicine.frequency}</td>
                        <td>{medicine.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dental-chart-section">
        <h2>Dental Chart</h2>
        <div className="dental-chart">
          <div className="upper-teeth dental-row">
            {teethStatus.slice(0, 16).map((status, index) => (
              <div
                key={index}
                className={`tooth ${status} ${selectedTooth === index ? 'selected' : ''}`}
                onClick={() => handleToothClick(index)}
              >
                <span className="tooth-number">{index + 1}</span>
                <div className="tooth-graphic">
                  {/* Use SVG or an image here */}
                  <div className={`tooth-icon ${status || 'normal'}`}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="lower-teeth dental-row">
            {teethStatus.slice(16).map((status, index) => (
              <div
                key={index + 16}
                className={`tooth ${status} ${selectedTooth === (index + 16) ? 'selected' : ''}`}
                onClick={() => handleToothClick(index + 16)}
              >
                <div className="tooth-graphic">
                  {/* Use SVG or an image here */}
                  <div className={`tooth-icon ${status || 'normal'}`}></div>
                </div>
                <span className="tooth-number">{index + 17}</span>
              </div>
            ))}
          </div>
        </div>
        {selectedTooth !== null && (
          <div className="tooth-actions">
            <p>Selected: Tooth #{selectedTooth + 1}</p>
            <select
              value={teethStatus[selectedTooth]}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="">Normal</option>
              <option value="filling">Filling</option>
              <option value="extraction">Extraction Needed</option>
              <option value="missing">Missing</option>
              <option value="decay">Decay</option>
              <option value="crown">Crown</option>
              <option value="bridge">Bridge</option>
              <option value="implant">Implant</option>
            </select>
          </div>
        )}
      </div>

      <div className="current-appointment">
        <h2>Current Appointment Notes</h2>
        <textarea
          className="notes-textarea"
          value={currentNotes}
          onChange={(e) => setCurrentNotes(e.target.value)}
          placeholder="Enter notes for the current appointment..."
          rows={4}
        />
        
        <h3>Work To Be Done</h3>
        <textarea
          className="work-textarea"
          value={workToBeDone}
          onChange={(e) => setWorkToBeDone(e.target.value)}
          placeholder="Describe the dental work that needs to be done..."
          rows={3}
        />
      </div>

      <div className="new-prescription">
        <h2>New Prescription</h2>
        <div className="prescription-form">
          <div className="form-row">
            <div className="form-group">
              <label>Medicine</label>
              <select 
                value={selectedMedicine} 
                onChange={(e) => setSelectedMedicine(e.target.value)}
              >
                <option value="">Select Medicine</option>
                {medicineList.map((medicine, index) => (
                  <option key={index} value={medicine}>{medicine}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Dosage</label>
              <input 
                type="text" 
                value={dosage} 
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g., 500mg"
              />
            </div>
            <div className="form-group">
              <label>Frequency</label>
              <input 
                type="text" 
                value={frequency} 
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="e.g., twice daily"
              />
            </div>
            <div className="form-group">
              <label>Duration</label>
              <input 
                type="text" 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 7 days"
              />
            </div>
            <button className="add-medicine-btn" onClick={handleAddMedicine}>
              Add Medicine
            </button>
          </div>
        </div>

        {newPrescription.length > 0 && (
          <div className="prescription-preview">
            <h3>Prescription Preview</h3>
            <table className="medicine-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {newPrescription.map((medicine, index) => (
                  <tr key={index}>
                    <td>{medicine.name}</td>
                    <td>{medicine.dosage}</td>
                    <td>{medicine.frequency}</td>
                    <td>{medicine.duration}</td>
                    <td>
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveMedicine(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="appointment-actions">
        <button className="cancel-btn" onClick={() => navigate("/appointments")}>
          Cancel
        </button>
        <button className="save-btn" onClick={handleSaveAppointment}>
          Save Appointment Details
        </button>
      </div>
    </div>
  );
};

export default AppointmentDetails;