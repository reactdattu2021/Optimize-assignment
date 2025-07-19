
import React, { useState, useEffect, useCallback } from 'react';
import { generateUniqueId, loadData, saveData } from './utils/dataService'; // Data service for persistence
import './App.css';
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
        setDoctors(prevDoctors => {
            return prevDoctors.map(doctor => {
                if (doctor.id === doctorId) {
                    const existingAssociationIndex = doctor.hospitals.findIndex(assoc => assoc.hospitalId === hospitalId);
                    const updatedHospitals = [...doctor.hospitals];

                    // Check for conflicting slots across all hospitals for this doctor
                    for (const hospAssoc of doctor.hospitals) {
                        if (hospAssoc.hospitalId !== hospitalId && hospAssoc.availability) { // Check other hospitals
                            for (const existingSlot of hospAssoc.availability) {
                                for (const newSlot of availabilitySlots) {
                                    if (existingSlot.date === newSlot.date && existingSlot.time === newSlot.time) {
                                        showAppMessage(`Conflicting slot: ${newSlot.date} at ${newSlot.time} is already set for ${doctor.name} at ${hospitals.find(h=>h.id===hospAssoc.hospitalId)?.name}.`, 'error');
                                        return doctor; // Return original doctor to prevent update
                                    }
                                }
                            }
                        }
                    }

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
                    showAppMessage(`Doctor ${doctor.name} association with ${hospitals.find(h=>h.id===hospitalId)?.name} updated.`, 'success');
                    return { ...doctor, hospitals: updatedHospitals };
                }
                return doctor;
            });
        });
    };

    // Patient Handlers
    const handleAddPatient = (newPatientData) => {
        const newPatient = { ...newPatientData, id: generateUniqueId('PAT') };
        setPatients(prev => [...prev, newPatient]);
        showAppMessage(`Patient "${newPatient.name}" registered successfully!`, 'success');
    };
    
    const handleBookAppointment = (patientId, doctorId, hospitalId, date, time, consultationFee) => {
        const newAppointment = {
            id: generateUniqueId('APT'),
            patientId,
            doctorId,
            hospitalId,
            date,
            time,
            consultationFee,
            status: 'booked',
            bookingDate: new Date().toISOString().split('T')[0] // Current date of booking
        };

        // Mark the slot as booked in doctor's availability
        setDoctors(prevDoctors => {
            return prevDoctors.map(doc => {
                if (doc.id === doctorId) {
                    const updatedHospitals = doc.hospitals.map(hospAssoc => {
                        if (hospAssoc.hospitalId === hospitalId) {
                            const updatedAvailability = hospAssoc.availability.map(slot => {
                                if (slot.date === date && slot.time === time) {
                                    return { ...slot, isBooked: true }; // Mark as booked
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
                        departments={departments} // Needed for specialization check
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
                    <section className="App-section">
                        <h2>Welcome to the Hospital & Appointment Management System!</h2>
                        <p>Please select your role from the navigation above to access the respective features.</p>
                        <div className="info-box">
                            <p><strong>Note:</strong> This is a simplified demo. All data is stored in your browser's local storage and will persist even if you close the tab, but not across different browsers or devices.</p>
                            <p>To start, register some hospitals as an "Hospital Admin", then some doctors, and finally patients to book appointments!</p>
                        </div>
                    </section>
                );
        }
    };
  return (
    <div className='App'>
    <Header activeRole={activeRole} setActiveRole={setActiveRole} />
    <Message message={message} type={messageType}/>
    <main>
                {renderContent()}
            </main>
    </div>
  )
}
export default App
