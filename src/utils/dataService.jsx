// src/utils/dataService.js

// --- In-Memory Data Store & ID Counters ---
let hospitals = [];
let doctors = [];
let patients = [];
let appointments = [];
let departments = [];

let hospitalIdCounter = 1;
let doctorIdCounter = 1;
let patientIdCounter = 1;
let appointmentIdCounter = 1;
let departmentIdCounter = 1;

// --- Utility Functions ---

export const generateUniqueId = (prefix) => {
    if (prefix === 'HOSP') return `HOSP${hospitalIdCounter++}`;
    if (prefix === 'DOC') return `DOC${doctorIdCounter++}`;
    if (prefix === 'PAT') return `PAT${patientIdCounter++}`;
    if (prefix === 'APT') return `APT${appointmentIdCounter++}`;
    if (prefix === 'DEPT') return `DEPT${departmentIdCounter++}`;
    return `${prefix}${Date.now()}`; // Fallback, less robust
};

export const loadData = () => {
    try {
        hospitals = JSON.parse(localStorage.getItem('hospitals')) || [];
        doctors = JSON.parse(localStorage.getItem('doctors')) || [];
        patients = JSON.parse(localStorage.getItem('patients')) || [];
        appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        departments = JSON.parse(localStorage.getItem('departments')) || [];

        // Update counters based on max existing IDs for persistence continuity
        if (hospitals.length > 0) hospitalIdCounter = Math.max(...hospitals.map(h => parseInt(h.id.replace('HOSP', '') || 0))) + 1;
        if (doctors.length > 0) doctorIdCounter = Math.max(...doctors.map(d => parseInt(d.id.replace('DOC', '') || 0))) + 1;
        if (patients.length > 0) patientIdCounter = Math.max(...patients.map(p => parseInt(p.id.replace('PAT', '') || 0))) + 1;
        if (appointments.length > 0) appointmentIdCounter = Math.max(...appointments.map(a => parseInt(a.id.replace('APT', '') || 0))) + 1;
        if (departments.length > 0) departmentIdCounter = Math.max(...departments.map(d => parseInt(d.id.replace('DEPT', '') || 0))) + 1;

        return { hospitals, doctors, patients, appointments, departments };
    } catch (error) {
        console.error("Failed to load data from localStorage:", error);
        return { hospitals: [], doctors: [], patients: [], appointments: [], departments: [] };
    }
};

export const saveData = (data) => {
    try {
        localStorage.setItem('hospitals', JSON.stringify(data.hospitals));
        localStorage.setItem('doctors', JSON.stringify(data.doctors));
        localStorage.setItem('patients', JSON.stringify(data.patients));
        localStorage.setItem('appointments', JSON.stringify(data.appointments));
        localStorage.setItem('departments', JSON.stringify(data.departments));
    } catch (error) {
        console.error("Failed to save data to localStorage:", error);
    }
};

// Export the current state arrays (should be treated as read-only from components)
// Components will receive the state via props from App.js
export const getHospitals = () => hospitals;
export const getDoctors = () => doctors;
export const getPatients = () => patients;
export const getAppointments = () => appointments;
export const getDepartments = () => departments;

// Functions to add/update specific entities (used by App.js to update its state)
export const addHospital = (newHospital) => {
    const data = loadData(); // Load current data before modification
    const updatedHospitals = [...data.hospitals, { ...newHospital, id: generateUniqueId('HOSP') }];
    saveData({ ...data, hospitals: updatedHospitals });
    return updatedHospitals;
};

export const addDepartment = (newDepartment) => {
    const data = loadData();
    const updatedDepartments = [...data.departments, { ...newDepartment, id: generateUniqueId('DEPT') }];
    saveData({ ...data, departments: updatedDepartments });
    return updatedDepartments;
};

export const addDoctor = (newDoctor) => {
    const data = loadData();
    const updatedDoctors = [...data.doctors, { ...newDoctor, id: generateUniqueId('DOC') }];
    saveData({ ...data, doctors: updatedDoctors });
    return updatedDoctors;
};

export const updateDoctor = (updatedDoctor) => {
    const data = loadData();
    const updatedDoctors = data.doctors.map(doc => doc.id === updatedDoctor.id ? updatedDoctor : doc);
    saveData({ ...data, doctors: updatedDoctors });
    return updatedDoctors;
};

export const addPatient = (newPatient) => {
    const data = loadData();
    const updatedPatients = [...data.patients, { ...newPatient, id: generateUniqueId('PAT') }];
    saveData({ ...data, patients: updatedPatients });
    return updatedPatients;
};

export const addAppointment = (newAppointment) => {
    const data = loadData();
    const updatedAppointments = [...data.appointments, { ...newAppointment, id: generateUniqueId('APT'), status: 'booked' }];
    saveData({ ...data, appointments: updatedAppointments });
    return updatedAppointments;
};

// Example for a comprehensive update function if needed for complex scenarios
export const updateAllData = (newData) => {
    hospitals = newData.hospitals || hospitals;
    doctors = newData.doctors || doctors;
    patients = newData.patients || patients;
    appointments = newData.appointments || appointments;
    departments = newData.departments || departments;
    saveData({ hospitals, doctors, patients, appointments, departments });
};