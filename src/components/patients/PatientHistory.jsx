// src/components/Patient/PatientHistory.js
import React from 'react';

const PatientHistory = ({ patientId, patients, doctors, hospitals, appointments }) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
        return <p>Patient not found.</p>;
    }

    const patientAppointments = appointments.filter(apt => apt.patientId === patientId)
        .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`)); // Sort by most recent

    return (
        <div className="report-container">
            <h3>Appointment History for {patient.name}</h3>
            {patientAppointments.length === 0 ? (
                <p>No appointments booked yet.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Doctor</th>
                            <th>Hospital</th>
                            <th>Fee Paid</th>
                            <th>Status</th>
                            <th>Booked On</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patientAppointments.map(apt => {
                            const doctor = doctors.find(d => d.id === apt.doctorId);
                            const hospital = hospitals.find(h => h.id === apt.hospitalId);
                            return (
                                <tr key={apt.id}>
                                    <td>{apt.date}</td>
                                    <td>{apt.time}</td>
                                    <td>{doctor ? `Dr. ${doctor.name}` : 'N/A'}</td>
                                    <td>{hospital ? hospital.name : 'N/A'}</td>
                                    <td>${apt.consultationFee.toFixed(2)}</td>
                                    <td>{apt.status}</td>
                                    <td>{apt.bookingDate}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PatientHistory;