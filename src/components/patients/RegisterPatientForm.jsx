// src/components/Patient/RegisterPatientForm.js
import React, { useState } from 'react';

const RegisterPatientForm = ({ addPatient, showAppMessage }) => {
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [uniqueId, setUniqueId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !gender || !dob || !uniqueId) {
            showAppMessage('Please fill all patient registration fields.', 'error');
            return;
        }
        addPatient({ name, gender, dob, uniqueId });
        setName('');
        setGender('');
        setDob('');
        setUniqueId('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Register as a Patient</h3>
            <div>
                <label htmlFor="patientName">Name:</label>
                <input
                    type="text"
                    id="patientName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="patientGender">Gender:</label>
                <select id="patientGender" value={gender} onChange={(e) => setGender(e.target.value)} required>
                    <option value="">-- Select Gender --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div>
                <label htmlFor="patientDOB">Date of Birth:</label>
                <input
                    type="date"
                    id="patientDOB"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="patientUniqueID">Unique ID (e.g., Aadhar, Passport):</label>
                <input
                    type="text"
                    id="patientUniqueID"
                    value={uniqueId}
                    onChange={(e) => setUniqueId(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="primary-btn">Register Patient</button>
        </form>
    );
};

export default RegisterPatientForm;