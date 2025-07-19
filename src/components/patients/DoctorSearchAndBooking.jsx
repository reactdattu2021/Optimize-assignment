// src/components/Patient/DoctorSearchAndBooking.js
import React, { useState } from 'react';
import SelectDropdown from '../Common/selectDropdown';

const DoctorSearchAndBooking = ({ doctors, hospitals, patients, appointments, bookAppointment, showAppMessage }) => {
    const [searchSpecialization, setSearchSpecialization] = useState('');
    const [searchHospital, setSearchHospital] = useState('');
    const [selectedPatient, setSelectedPatient] = useState('');
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null); // { doctorId, hospitalId, date, time, fee }

    const handleSearch = () => {
        // This function doesn't actually filter here, it just triggers re-render with new filter states
        // The filtering happens within the render logic based on the state.
    };

    const openBookingModal = (doctorId, hospitalId, date, time, fee) => {
        if (patients.length === 0) {
            showAppMessage('Please register as a patient first to book an appointment.', 'error');
            return;
        }
        setBookingDetails({ doctorId, hospitalId, date, time, fee });
        setShowBookingModal(true);
    };

    const handleConfirmBooking = (e) => {
        e.preventDefault();
        if (!selectedPatient || !bookingDetails) {
            showAppMessage('Please select a patient or booking details are missing.', 'error');
            return;
        }

        const { doctorId, hospitalId, date, time, fee } = bookingDetails;
        bookAppointment(selectedPatient, doctorId, hospitalId, date, time, fee);

        // Reset modal state
        setShowBookingModal(false);
        setBookingDetails(null);
        setSelectedPatient('');
    };

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSpecialization = searchSpecialization === '' ||
            doctor.specializations.some(s => s.toLowerCase().includes(searchSpecialization.toLowerCase()));
        const matchesHospital = searchHospital === '' ||
            doctor.hospitals.some(h => h.hospitalId === searchHospital);
        return matchesSpecialization && matchesHospital;
    });

    return (
        <div>
            <div className="filter-group">
                <div>
                    <label htmlFor="searchSpecialization">Specialization:</label>
                    <input
                        type="text"
                        id="searchSpecialization"
                        placeholder="e.g., Cardiology"
                        value={searchSpecialization}
                        onChange={(e) => setSearchSpecialization(e.target.value)}
                    />
                </div>
                <SelectDropdown
                    label="Hospital:"
                    id="searchHospital"
                    value={searchHospital}
                    onChange={(e) => setSearchHospital(e.target.value)}
                    options={hospitals.map(h => ({ value: h.id, label: h.name }))}
                    defaultOptionLabel="All Hospitals"
                />
                <button type="button" onClick={handleSearch} className="secondary-btn">Search Doctors</button>
            </div>

            <div id="doctorSearchResults">
                {filteredDoctors.length === 0 ? (
                    <p>No doctors found matching your criteria. Try adjusting your filters.</p>
                ) : (
                    filteredDoctors.map(doctor => (
                        <div key={doctor.id} className="doctor-card">
                            <h4>Dr. {doctor.name}</h4>
                            <p><strong>Qualifications:</strong> {doctor.qualifications}</p>
                            <p><strong>Specializations:</strong> {doctor.specializations.join(', ')}</p>
                            <p><strong>Experience:</strong> {doctor.experience} years</p>
                            <h5>Available at:</h5>
                            <ul>
                                {doctor.hospitals
                                    .filter(h => h.availability && h.availability.length > 0 && (searchHospital === '' || h.hospitalId === searchHospital))
                                    .map(hospAssoc => {
                                        const hospital = hospitals.find(h => h.id === hospAssoc.hospitalId);
                                        return hospital && (
                                            <li key={`${doctor.id}-${hospital.id}`}>
                                                <strong>{hospital.name}</strong> (Fee: ${hospAssoc.consultationFee.toFixed(2)})<br />
                                                <div className="availability-slots-container">
                                                    {hospAssoc.availability
                                                        .slice() // Create a shallow copy to sort without mutating original
                                                        .sort((a, b) => {
                                                            const dateTimeA = new Date(`${a.date}T${a.time}`);
                                                            const dateTimeB = new Date(`${b.date}T${b.time}`);
                                                            return dateTimeA - dateTimeB;
                                                        })
                                                        .map((slot, index) => {
                                                            const isBooked = appointments.some(apt =>
                                                                apt.doctorId === doctor.id &&
                                                                apt.hospitalId === hospital.id &&
                                                                apt.date === slot.date &&
                                                                apt.time === slot.time &&
                                                                apt.status === 'booked'
                                                            );
                                                            return (
                                                                <span
                                                                    key={`${doctor.id}-${hospital.id}-${index}`}
                                                                    className={`availability-slot ${isBooked ? 'booked' : ''}`}
                                                                    onClick={!isBooked ? () => openBookingModal(doctor.id, hospital.id, slot.date, slot.time, hospAssoc.consultationFee) : null}
                                                                    title={isBooked ? 'Booked' : 'Click to book'}
                                                                >
                                                                    {slot.date} {slot.time}
                                                                </span>
                                                            );
                                                        })}
                                                </div>
                                            </li>
                                        );
                                    })}
                            </ul>
                        </div>
                    ))
                )}
            </div>

            {showBookingModal && bookingDetails && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <button className="modal-close-btn" onClick={() => setShowBookingModal(false)}>&times;</button>
                        <h3>Confirm Appointment</h3>
                        <p><strong>Doctor:</strong> {doctors.find(d => d.id === bookingDetails.doctorId)?.name}</p>
                        <p><strong>Hospital:</strong> {hospitals.find(h => h.id === bookingDetails.hospitalId)?.name}</p>
                        <p><strong>Date:</strong> {bookingDetails.date}</p>
                        <p><strong>Time:</strong> {bookingDetails.time}</p>
                        <p><strong>Consultation Fee:</strong> ${bookingDetails.fee.toFixed(2)}</p>

                        <form onSubmit={handleConfirmBooking} style={{border: 'none', padding: '0'}}>
                            <SelectDropdown
                                label="Select Patient"
                                id="selectPatientForBooking"
                                value={selectedPatient}
                                onChange={(e) => setSelectedPatient(e.target.value)}
                                options={patients.map(p => ({ value: p.id, label: p.name }))}
                                defaultOptionLabel="-- Select Your Profile --"
                                required
                            />
                            <button type="submit" className="primary-btn">Confirm Booking</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorSearchAndBooking;