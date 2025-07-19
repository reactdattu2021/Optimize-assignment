// src/components/HospitalAdmin/RegisterHospitalForm.js
import React, { useState } from 'react';

const RegisterHospitalForm = ({ addHospital, showAppMessage }) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !location) {
            showAppMessage('Please fill in all hospital details.', 'error');
            return;
        }
        addHospital({ name, location });
        setName('');
        setLocation('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Register New Hospital</h3>
            <div>
                <label htmlFor="hospitalName">Hospital Name:</label>
                <input
                    type="text"
                    id="hospitalName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="hospitalLocation">Location:</label>
                <input
                    type="text"
                    id="hospitalLocation"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="primary-btn">Register Hospital</button>
        </form>
    );
};

export default RegisterHospitalForm;