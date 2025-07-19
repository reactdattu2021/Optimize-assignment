// src/components/Header.js
import React from 'react';

const Header = ({ activeRole, setActiveRole }) => {
    return (
        <header>
            <h1>Hospital & Appointment Management System</h1>
            <nav>
                <button
                    className={activeRole === 'landing' ? 'active' : ''}
                    onClick={() => setActiveRole('landing')}
                >
                    Home
                </button>
                <button
                    className={activeRole === 'admin' ? 'active' : ''}
                    onClick={() => setActiveRole('admin')}
                >
                    Hospital Admin
                </button>
                <button
                    className={activeRole === 'doctor' ? 'active' : ''}
                    onClick={() => setActiveRole('doctor')}
                >
                    Doctor
                </button>
                <button
                    className={activeRole === 'patient' ? 'active' : ''}
                    onClick={() => setActiveRole('patient')}
                >
                    Patient
                </button>
            </nav>
        </header>
    );
};

export default Header;