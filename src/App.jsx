import React, { useState, useEffect, useCallback } from 'react';
import { generateUniqueId, loadData, saveData } from './utils/dataService';
import './App.css'; // Your main CSS file
import Header from './components/Header';
import Message from './components/Common/message';
import HospitalAdminDashboard from './components/Hospitaladmin1/HospitalAdminDashboard';
import DoctorDashboard from './components/doctors/DoctorDashboard';
import PatientDashboard from './components/patients/PatientDashboard';

const App = () => {
    // Global State for all entities
    const [hospitals, setHospitals] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [activeRole, setActiveRole] = useState('landing'); // 'landing', 'admin', 'doctor', 'patient'
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');

    // Load data from localStorage on initial mount
    useEffect(() => {
        const { hospitals, doctors, patients, appointments, departments } = loadData();
        setHospitals(hospitals);
        setDoctors(doctors);
        setPatients(patients);
        setAppointments(appointments);
        setDepartments(departments);
    }, []);

    // Save data to localStorage whenever any relevant state changes
    useEffect(() => {
        saveData({ hospitals, doctors, patients, appointments, departments });
    }, [hospitals, doctors, patients, appointments, departments]);

    // Callback to display messages (passed to child components)
    const showAppMessage = useCallback((msg, type) => {
        setMessage(msg);
        setMessageType(type);
        const timer = setTimeout(() => {
            setMessage('');
            setMessageType('success');
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    // --- Handlers for Data Operations (Passed to specific dashboards/forms) ---

    // Hospital Admin Handlers
    const handleAddHospital = (newHospitalData) => {
        const newHospital = { ...newHospitalData, id: generateUniqueId('HOSP') };
        setHospitals(prev => [...prev, newHospital]);
        showAppMessage(`Hospital "${newHospital.name}" registered successfully!`, 'success');
    };

    const handleAddDepartment = (hospitalId, departmentName) => {
        const hospitalDepartments = departments.filter(d => d.hospitalId === hospitalId);
        if (hospitalDepartments.some(d => d.name.toLowerCase() === departmentName.toLowerCase())) {
            showAppMessage(`Department "${departmentName}" already exists in this hospital.`, 'error');
            return false;
        }

        const newDepartment = { id: generateUniqueId('DEPT'), hospitalId, name: departmentName };
        setDepartments(prev => [...prev, newDepartment]);
        showAppMessage(`Department "${departmentName}" added successfully.`, 'success');
        return true;
    };

    // Doctor Handlers
    const handleAddDoctor = (newDoctorData) => {
        const newDoctor = { ...newDoctorData, id: generateUniqueId('DOC'), hospitals: [] };
        setDoctors(prev => [...prev, newDoctor]);
        showAppMessage(`Doctor "${newDoctor.name}" registered successfully!`, 'success');
    };

    const handleUpdateDoctorAssociation = (doctorId, hospitalId, consultationFee, availabilitySlots, doctorSpecializations) => {
        let hasConflict = false;
        setDoctors(prevDoctors => {
            const updatedDoctors = prevDoctors.map(doctor => {
                if (doctor.id === doctorId) {
                    for (const hospAssoc of doctor.hospitals) {
                        if (hospAssoc.hospitalId !== hospitalId && hospAssoc.availability) {
                            for (const existingSlot of hospAssoc.availability) {
                                for (const newSlot of availabilitySlots) {
                                    if (existingSlot.date === newSlot.date && existingSlot.time === newSlot.time) {
                                        showAppMessage(`Conflicting slot: ${newSlot.date} at ${newSlot.time} is already set for ${doctor.name} at ${hospitals.find(h => h.id === hospAssoc.hospitalId)?.name}.`, 'error');
                                        hasConflict = true;
                                        return doctor;
                                    }
                                }
                            }
                        }
                    }

                    if (hasConflict) return doctor;

                    const existingAssociationIndex = doctor.hospitals.findIndex(assoc => assoc.hospitalId === hospitalId);
                    const updatedHospitals = [...doctor.hospitals];

                    if (existingAssociationIndex !== -1) {
                        updatedHospitals[existingAssociationIndex] = {
                            ...updatedHospitals[existingAssociationIndex],
                            consultationFee,
                            availability: availabilitySlots,
                            specializations: doctorSpecializations
                        };
                    } else {
                        updatedHospitals.push({
                            hospitalId,
                            consultationFee,
                            availability: availabilitySlots,
                            specializations: doctorSpecializations
                        });
                    }
                    showAppMessage(`Doctor ${doctor.name} association with ${hospitals.find(h => h.id === hospitalId)?.name} updated.`, 'success');
                    return { ...doctor, hospitals: updatedHospitals, specializations: Array.from(new Set([...doctor.specializations, ...doctorSpecializations])) };
                }
                return doctor;
            });
            return updatedDoctors;
        });
        return !hasConflict;
    };

    // Patient Handlers
    const handleAddPatient = (newPatientData) => {
        const newPatient = { ...newPatientData, id: generateUniqueId('PAT') };
        setPatients(prev => [...prev, newPatient]);
        showAppMessage(`Patient "${newPatient.name}" registered successfully!`, 'success');
    };

    const handleBookAppointment = (patientId, doctorId, hospitalId, date, time, consultationFee) => {
        const isAlreadyBooked = appointments.some(apt =>
            apt.doctorId === doctorId &&
            apt.hospitalId === hospitalId &&
            apt.date === date &&
            apt.time === time &&
            apt.status === 'booked'
        );

        if (isAlreadyBooked) {
            showAppMessage('This appointment slot has just been booked by another patient. Please choose another time.', 'error');
            return;
        }

        const newAppointment = {
            id: generateUniqueId('APT'),
            patientId,
            doctorId,
            hospitalId,
            date,
            time,
            consultationFee,
            status: 'booked',
            bookingDate: new Date().toISOString().split('T')[0]
        };

        setDoctors(prevDoctors => {
            return prevDoctors.map(doc => {
                if (doc.id === doctorId) {
                    const updatedHospitals = doc.hospitals.map(hospAssoc => {
                        if (hospAssoc.hospitalId === hospitalId) {
                            const updatedAvailability = hospAssoc.availability.map(slot => {
                                if (slot.date === date && slot.time === time) {
                                    return { ...slot, isBooked: true };
                                }
                                return slot;
                            });
                            return { ...hospAssoc, availability: updatedAvailability };
                        }
                        return hospAssoc;
                    });
                    return { ...doc, hospitals: updatedHospitals };
                }
                return doc;
            });
        });

        setAppointments(prev => [...prev, newAppointment]);
        showAppMessage('Appointment booked successfully!', 'success');
    };

    // Render the appropriate dashboard based on activeRole
    const renderContent = () => {
        switch (activeRole) {
            case 'admin':
                return (
                    <HospitalAdminDashboard
                        hospitals={hospitals}
                        doctors={doctors}
                        departments={departments}
                        appointments={appointments}
                        addHospital={handleAddHospital}
                        addDepartment={handleAddDepartment}
                        showAppMessage={showAppMessage}
                    />
                );
            case 'doctor':
                return (
                    <DoctorDashboard
                        doctors={doctors}
                        hospitals={hospitals}
                        departments={departments}
                        appointments={appointments}
                        addDoctor={handleAddDoctor}
                        updateDoctorAssociation={handleUpdateDoctorAssociation}
                        showAppMessage={showAppMessage}
                    />
                );
            case 'patient':
                return (
                    <PatientDashboard
                        patients={patients}
                        doctors={doctors}
                        hospitals={hospitals}
                        appointments={appointments}
                        addPatient={handleAddPatient}
                        bookAppointment={handleBookAppointment}
                        showAppMessage={showAppMessage}
                    />
                );
            case 'landing':
            default:
                return (
                    <section className="App-landing-section">
                        <div className="landing-hero"> {/* New: Hero section for primary message */}
                            <h2 className="hero-title">Your Health, Our Priority</h2>
                            <p className="hero-subtitle">Streamlining Healthcare Management for a Healthier Community.</p>
                            <p className="hero-description">Seamlessly connect hospitals, doctors, and patients for efficient appointments and comprehensive care.</p>
                        </div>

                        <div className="call-to-action-section"> {/* New: Clear call to action */}
                            <p>Ready to get started? Select your role:</p>
                            <div className="role-selection-hint">
                                <span className="role-chip">Hospital Admin</span>
                                <span className="role-chip">Doctor</span>
                                <span className="role-chip">Patient</span>
                            </div>
                            <p className="instruction-text">Use the navigation buttons above to access your dashboard.</p>
                        </div>

                        <div className="feature-highlight-section"> {/* New: Encapsulate features */}
                            <h3>What You Can Do:</h3>
                            <div className="feature-grid"> {/* New: Grid for features */}
                                <div className="feature-card">
                                    <i className="feature-icon fas fa-hospital"></i> {/* Example icon */}
                                    <h4>Hospital Management</h4>
                                    <p>Register new hospitals and organize their specialized departments efficiently.</p>
                                </div>
                                <div className="feature-card">
                                    <i className="feature-icon fas fa-user-md"></i> {/* Example icon */}
                                    <h4>Doctor Services</h4>
                                    <p>Onboard doctors, assign them to hospitals, and manage their availability & consultation fees.</p>
                                </div>
                                <div className="feature-card">
                                    <i className="feature-icon fas fa-users"></i> {/* Example icon */}
                                    <h4>Patient Portal</h4>
                                    <p>Register as a patient, find doctors by specialization, and book appointments with ease.</p>
                                </div>
                                <div className="feature-card">
                                    <i className="feature-icon fas fa-calendar-check"></i> {/* Example icon */}
                                    <h4>Appointment Tracking</h4>
                                    <p>Keep a clear overview of all scheduled and pending appointments.</p>
                                </div>
                            </div>
                        </div>

                        <div className="info-box-landing"> {/* Specific info box for landing */}
                            <p><strong>Heads Up:</strong> This is a **demo application** built with React! All data is stored in your browser's **local storage**, meaning it persists across sessions on *your* device but won't sync elsewhere. To start, register a hospital as an "Hospital Admin," then a doctor, and finally a patient to explore the full functionalities!</p>
                        </div>
                    </section>
                );
        }
    };

    return (
        <div className='App'>
            <Header activeRole={activeRole} setActiveRole={setActiveRole} />
            <Message message={message} type={messageType} />
            <main>
                {renderContent()}
            </main>
        </div>
    );
};

export default App;