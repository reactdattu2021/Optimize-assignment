// src/components/HospitalAdmin/ManageDepartments.js
import React, { useState } from 'react';
import SelectDropdown from '../Common/selectDropdown';

const ManageDepartments = ({ hospitals, departments, addDepartment, selectedHospital, setSelectedHospital, showAppMessage }) => {
    const [departmentName, setDepartmentName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedHospital || !departmentName) {
            showAppMessage('Please select a hospital and enter a department name.', 'error');
            return;
        }
        const success = addDepartment(selectedHospital, departmentName);
        if (success) {
            setDepartmentName('');
        }
    };

    const currentHospitalDepartments = departments.filter(d => d.hospitalId === selectedHospital);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <SelectDropdown
                    label="Select Hospital"
                    id="selectHospitalForDept"
                    value={selectedHospital}
                    onChange={(e) => setSelectedHospital(e.target.value)}
                    options={hospitals.map(h => ({ value: h.id, label: h.name }))}
                    defaultOptionLabel="-- Select Hospital --"
                    required
                />
                <div>
                    <label htmlFor="departmentName">Department Name:</label>
                    <input
                        type="text"
                        id="departmentName"
                        value={departmentName}
                        onChange={(e) => setDepartmentName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="primary-btn">Add Department</button>
            </form>

            <h3>Departments by Hospital</h3>
            {hospitals.length === 0 ? (
                <p>No hospitals registered to manage departments for yet.</p>
            ) : (
                hospitals.map(hospital => (
                    <div key={hospital.id} style={{ marginBottom: '15px', border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
                        <h4>{hospital.name} Departments:</h4>
                        {departments.filter(d => d.hospitalId === hospital.id).length === 0 ? (
                            <p>No departments added yet for this hospital.</p>
                        ) : (
                            <ul>
                                {departments.filter(d => d.hospitalId === hospital.id).map(dept => (
                                    <li key={dept.id}>{dept.name}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default ManageDepartments;