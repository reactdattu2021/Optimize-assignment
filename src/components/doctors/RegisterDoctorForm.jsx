// src/components/Doctor/RegisterDoctorForm.js
import React, { useState } from 'react';

const RegisterDoctorForm = ({ addDoctor, showAppMessage }) => {
    const [name, setName] = useState('');
    const [qualifications, setQualifications] = useState('');
    const [specializations, setSpecializations] = useState(''); // Comma-separated string
    const [experience, setExperience] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const specsArray = specializations.split(',').map(s => s.trim()).filter(s => s !== '');
        if (!name || !qualifications || specsArray.length === 0 || experience === '') {
            showAppMessage('Please fill all required fields.', 'error');
            return;
        }

        addDoctor({
            name,
            qualifications,
            specializations: specsArray,
            experience: parseInt(experience)
        });
        setName('');
        setQualifications('');
        setSpecializations('');
        setExperience('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Register as a Doctor</h3>
            <div>
                <label htmlFor="doctorName">Name:</label>
                <input
                    type="text"
                    id="doctorName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="doctorQualifications">Qualifications (e.g., MBBS, MD):</label>
                <input
                    type="text"
                    id="doctorQualifications"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="doctorSpecializations">Specializations (comma-separated):</label>
                <input
                    type="text"
                    id="doctorSpecializations"
                    value={specializations}
                    onChange={(e) => setSpecializations(e.target.value)}
                    placeholder="e.g., Cardiology, Orthopedics"
                    required
                />
            </div>
            <div>
                <label htmlFor="doctorExperience">Years of Experience:</label>
                <input
                    type="number"
                    id="doctorExperience"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    min="0"
                    required
                />
            </div>
            <button type="submit" className="primary-btn">Register Doctor</button>
        </form>
    );
};

export default RegisterDoctorForm;