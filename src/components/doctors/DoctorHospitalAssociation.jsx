// src/components/Doctor/DoctorHospitalAssociation.js
import React, { useState, useEffect } from 'react';
import SelectDropdown from '../Common/selectDropdown';

const DoctorHospitalAssociation = ({ doctors, hospitals, departments, updateDoctorAssociation, showAppMessage, selectedDoctor, setSelectedDoctor }) => {
    const [selectedHospital, setSelectedHospital] = useState('');
    const [consultationFee, setConsultationFee] = useState('');
    const [availabilityDate, setAvailabilityDate] = useState('');
    const [availabilityTime, setAvailabilityTime] = useState('');
    const [currentAvailabilitySlots, setCurrentAvailabilitySlots] = useState([]); // Slots for the *currently selected* doctor-hospital pair

    // Effect to update form fields when selectedDoctor or selectedHospital changes
    useEffect(() => {
        const doctor = doctors.find(d => d.id === selectedDoctor);
        if (doctor) {
            const association = doctor.hospitals.find(h => h.hospitalId === selectedHospital);
            if (association) {
                setConsultationFee(association.consultationFee);
                // Deep copy availability to ensure local state doesn't mutate global state directly
                setCurrentAvailabilitySlots(JSON.parse(JSON.stringify(association.availability || [])));
            } else {
                setConsultationFee('');
                setCurrentAvailabilitySlots([]);
            }
        } else {
            setConsultationFee('');
            setCurrentAvailabilitySlots([]);
            setSelectedHospital(''); // Clear hospital selection if no doctor
        }
    }, [selectedDoctor, selectedHospital, doctors]);

    const handleAddSlot = () => {
        if (!availabilityDate || !availabilityTime) {
            showAppMessage('Please select a date and time for the slot.', 'error');
            return;
        }

        const newSlot = { date: availabilityDate, time: availabilityTime, isBooked: false };

        // Check for conflicts within current planned slots for this association
        if (currentAvailabilitySlots.some(s => s.date === newSlot.date && s.time === newSlot.time)) {
            showAppMessage(`Slot ${newSlot.date} at ${newSlot.time} is already added for this hospital.`, 'error');
            return;
        }

        setCurrentAvailabilitySlots(prev => [...prev, newSlot]);
        setAvailabilityDate('');
        setAvailabilityTime('');
        showAppMessage('Slot added to list. Click "Associate & Save Availability" to confirm.', 'success');
    };

    const handleRemoveSlot = (indexToRemove) => {
        setCurrentAvailabilitySlots(prev => prev.filter((_, index) => index !== indexToRemove));
        showAppMessage('Slot removed from list. Click "Associate & Save Availability" to save changes.', 'success');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedDoctor || !selectedHospital || consultationFee === '' || isNaN(parseFloat(consultationFee))) {
            showAppMessage('Please select a doctor and hospital, and enter a valid consultation fee.', 'error');
            return;
        }

        const doctor = doctors.find(d => d.id === selectedDoctor);
        const hospital = hospitals.find(h => h.id === selectedHospital);

        if (!doctor || !hospital) {
            showAppMessage('Doctor or Hospital not found.', 'error');
            return;
        }

        // Check if hospital has departments matching doctor's specializations
        const hospitalDepartments = departments.filter(d => d.hospitalId === selectedHospital).map(d => d.name.toLowerCase());
        const doctorSpecializationsLowercase = doctor.specializations.map(s => s.toLowerCase());
        const hasMatchingDepartment = doctorSpecializationsLowercase.some(spec => hospitalDepartments.includes(spec));

        if (!hasMatchingDepartment) {
            showAppMessage(`Doctor's specializations (${doctor.specializations.join(', ')}) do not match any departments in ${hospital.name}.`, 'error');
            return;
        }
        
        // This function includes the cross-hospital conflict check within App.js for global state management
        updateDoctorAssociation(selectedDoctor, selectedHospital, parseFloat(consultationFee), currentAvailabilitySlots, doctor.specializations);
    };

    return (
        <form onSubmit={handleSubmit}>
            <SelectDropdown
                label="Select Doctor"
                id="selectDoctorForAssociation"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                options={doctors.map(d => ({ value: d.id, label: d.name }))}
                defaultOptionLabel="-- Select Doctor --"
                required
            />

            <SelectDropdown
                label="Select Hospital"
                id="selectHospitalForDoctor"
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
                options={hospitals.map(h => ({ value: h.id, label: h.name }))}
                defaultOptionLabel="-- Select Hospital --"
                required
            />

            <div>
                <label htmlFor="consultationFee">Consultation Fee:</label>
                <input
                    type="number"
                    id="consultationFee"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value)}
                    min="0"
                    step="0.01"
                    required
                />
            </div>

            <h4>Set Availability Slots</h4>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                    <label htmlFor="availabilityDate">Date:</label>
                    <input
                        type="date"
                        id="availabilityDate"
                        value={availabilityDate}
                        onChange={(e) => setAvailabilityDate(e.target.value)}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label htmlFor="availabilityTime">Time (HH:MM):</label>
                    <input
                        type="time"
                        id="availabilityTime"
                        value={availabilityTime}
                        onChange={(e) => setAvailabilityTime(e.target.value)}
                    />
                </div>
                <button type="button" onClick={handleAddSlot} className="secondary-btn" style={{ minWidth: '120px', padding: '12px', marginBottom: '1px' }}>
                    Add Slot
                </button>
            </div>

            <div className="availability-slots-container">
                {currentAvailabilitySlots.length === 0 ? (
                    <p>No slots added for this association yet.</p>
                ) : (
                    currentAvailabilitySlots.map((slot, index) => (
                        <span key={index} className="availability-slot">
                            {slot.date} {slot.time}
                            <button
                                type="button"
                                onClick={() => handleRemoveSlot(index)}
                                style={{ marginLeft: '8px', background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '1em' }}
                            >
                                x
                            </button>
                        </span>
                    ))
                )}
            </div>

            <button type="submit" className="primary-btn" style={{ marginTop: '20px' }}>
                Associate & Save Availability
            </button>
        </form>
    );
};

export default DoctorHospitalAssociation;