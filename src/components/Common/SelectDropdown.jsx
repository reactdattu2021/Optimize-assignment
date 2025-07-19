// src/components/Common/SelectDropdown.js
import React from 'react';

const SelectDropdown = ({ label, id, value, onChange, options, defaultOptionLabel, required = false }) => {
    return (
        <div>
            <label htmlFor={id}>{label}:</label>
            <select id={id} value={value} onChange={onChange} required={required}>
                <option value="">{defaultOptionLabel}</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectDropdown;