// src/components/Doctor/DoctorDashboard.js
import React, { useState, useEffect } from 'react';
import RegisterDoctorForm from './RegisterDoctorForm';
import DoctorHospitalAssociation from './DoctorHospitalAssociation';
import DoctorReports from './DoctorReports';
import SelectDropdown from '../Common/selectDropdown';

const DoctorDashboard = ({ doctors, hospitals, departments, appointments, addDoctor, updateDoctorAssociation, showAppMessage }) => {
    const [selectedDoctorForAssociation, setSelectedDoctorForAssociation] = useState('');
    const [selectedDoctorForReport, setSelectedDoctorForReport] = useState('');

    useEffect(() => {
        if (!doctors.some(d => d.id === selectedDoctorForAssociation)) {
            setSelectedDoctorForAssociation('');
        }
        if (!doctors.some(d => d.id === selectedDoctorForReport)) {
            setSelectedDoctorForReport('');
        }
    }, [doctors, selectedDoctorForAssociation, selectedDoctorForReport]);

    return (
        <section>
            <h2>Doctor Dashboard</h2>

            <RegisterDoctorForm addDoctor={addDoctor} showAppMessage={showAppMessage} />

            <h3>Associate with Hospital & Set Availability</h3>
            <DoctorHospitalAssociation
                doctors={doctors}
                hospitals={hospitals}
                departments={departments}
                updateDoctorAssociation={updateDoctorAssociation}
                showAppMessage={showAppMessage}
                selectedDoctor={selectedDoctorForAssociation}
                setSelectedDoctor={setSelectedDoctorForAssociation}
            />

            <h3>Your Earnings & Consultations</h3>
            <div style={{ marginBottom: '20px' }}>
                <SelectDropdown
                    label="Select Doctor for Report"
                    id="selectDoctorForReport"
                    value={selectedDoctorForReport}
                    onChange={(e) => setSelectedDoctorForReport(e.target.value)}
                    options={doctors.map(d => ({ value: d.id, label: d.name }))}
                    defaultOptionLabel="-- Select Doctor --"
                />
            </div>
            {selectedDoctorForReport && (
                <DoctorReports
                    doctorId={selectedDoctorForReport}
                    doctors={doctors}
                    hospitals={hospitals}
                    appointments={appointments}
                />
            )}
            {!selectedDoctorForReport && <p>Please select a doctor to view their reports.</p>}
        </section>
    );
};

export default DoctorDashboard;