// src/components/HospitalAdmin/HospitalAdminDashboard.js
import React, { useState, useEffect } from 'react';
import RegisterHospitalForm from './RegisterHospitalForm';
import ManageDepartments from './ManageDepartments';
import HospitalReports from './HospitalReports';
import SelectDropdown from '../Common/selectDropdown';

const HospitalAdminDashboard = ({ hospitals, doctors, departments, appointments, addHospital, addDepartment, showAppMessage }) => {
    const [selectedHospitalForDept, setSelectedHospitalForDept] = useState('');
    const [selectedHospitalForReport, setSelectedHospitalForReport] = useState('');

    // Ensure dropdowns are updated when hospitals change
    useEffect(() => {
        if (!hospitals.some(h => h.id === selectedHospitalForDept)) {
            setSelectedHospitalForDept('');
        }
        if (!hospitals.some(h => h.id === selectedHospitalForReport)) {
            setSelectedHospitalForReport('');
        }
    }, [hospitals, selectedHospitalForDept, selectedHospitalForReport]);

    return (
        <section>
            <h2>Hospital Admin Dashboard</h2>

            <RegisterHospitalForm addHospital={addHospital} showAppMessage={showAppMessage} />

            <h3>Manage Departments</h3>
            <ManageDepartments
                hospitals={hospitals}
                departments={departments}
                addDepartment={addDepartment}
                selectedHospital={selectedHospitalForDept}
                setSelectedHospital={setSelectedHospitalForDept}
                showAppMessage={showAppMessage}
            />

            <h3>Hospital Reports</h3>
            <div style={{ marginBottom: '20px' }}>
                <SelectDropdown
                    label="Select Hospital for Report"
                    id="reportHospitalSelect"
                    value={selectedHospitalForReport}
                    onChange={(e) => setSelectedHospitalForReport(e.target.value)}
                    options={hospitals.map(h => ({ value: h.id, label: h.name }))}
                    defaultOptionLabel="-- Select Hospital --"
                />
            </div>
            {selectedHospitalForReport && (
                <HospitalReports
                    hospitalId={selectedHospitalForReport}
                    hospitals={hospitals}
                    doctors={doctors}
                    departments={departments}
                    appointments={appointments}
                />
            )}
            {!selectedHospitalForReport && <p>Please select a hospital to view its reports.</p>}
        </section>
    );
};

export default HospitalAdminDashboard;