// src/components/Patient/PatientDashboard.js
import React, { useState, useEffect } from 'react';
import RegisterPatientForm from './RegisterPatientForm';
import DoctorSearchAndBooking from './DoctorSearchAndBooking';
import PatientHistory from './PatientHistory';
import SelectDropdown from '../Common/selectDropdown';

const PatientDashboard = ({ patients, doctors, hospitals, appointments, addPatient, bookAppointment, showAppMessage }) => {
    const [selectedPatientForHistory, setSelectedPatientForHistory] = useState('');

    useEffect(() => {
        if (!patients.some(p => p.id === selectedPatientForHistory)) {
            setSelectedPatientForHistory('');
        }
    }, [patients, selectedPatientForHistory]);

    return (
        <section>
            <h2>Patient Dashboard</h2>

            <RegisterPatientForm addPatient={addPatient} showAppMessage={showAppMessage} />

            <h3>Book an Appointment</h3>
            <DoctorSearchAndBooking
                doctors={doctors}
                hospitals={hospitals}
                patients={patients}
                appointments={appointments}
                bookAppointment={bookAppointment}
                showAppMessage={showAppMessage}
            />

            <h3>My Appointment History</h3>
            <div style={{ marginBottom: '20px' }}>
                <SelectDropdown
                    label="Select Patient for History"
                    id="selectPatientForHistory"
                    value={selectedPatientForHistory}
                    onChange={(e) => setSelectedPatientForHistory(e.target.value)}
                    options={patients.map(p => ({ value: p.id, label: p.name }))}
                    defaultOptionLabel="-- Select Patient --"
                />
            </div>
            {selectedPatientForHistory && (
                <PatientHistory
                    patientId={selectedPatientForHistory}
                    patients={patients}
                    doctors={doctors}
                    hospitals={hospitals}
                    appointments={appointments}
                />
            )}
            {!selectedPatientForHistory && <p>Please select a patient to view their appointment history.</p>}
        </section>
    );
};

export default PatientDashboard;