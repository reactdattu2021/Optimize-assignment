// src/components/Doctor/DoctorReports.js
import React from 'react';

const DoctorReports = ({ doctorId, doctors, hospitals, appointments }) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) {
        return <p>Doctor not found.</p>;
    }

    const doctorAppointments = appointments.filter(apt => apt.doctorId === doctorId && apt.status === 'booked');
    const totalConsultations = doctorAppointments.length;
    let totalDoctorEarnings = 0;
    const earningsByHospital = {};

    doctorAppointments.forEach(apt => {
        const doctorShare = apt.consultationFee * 0.60; // 60% to doctor
        totalDoctorEarnings += doctorShare;

        const hospitalName = hospitals.find(h => h.id === apt.hospitalId)?.name || 'Unknown Hospital';
        if (!earningsByHospital[hospitalName]) {
            earningsByHospital[hospitalName] = 0;
        }
        earningsByHospital[hospitalName] += doctorShare;
    });

    return (
        <div className="report-container">
            <h3>Earnings Report for Dr. {doctor.name}</h3>
            <p><strong>Total Consultations:</strong> {totalConsultations}</p>
            <p><strong>Total Earnings (Across all Hospitals):</strong> ${totalDoctorEarnings.toFixed(2)}</p>

            <h4>Earnings per Hospital:</h4>
            {Object.keys(earningsByHospital).length === 0 ? (
                <p>No earnings yet.</p>
            ) : (
                <ul>
                    {Object.keys(earningsByHospital).map(hospName => (
                        <li key={hospName}>{hospName}: ${earningsByHospital[hospName].toFixed(2)}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DoctorReports;