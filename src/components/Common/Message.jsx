// src/components/Common/Message.js
import React, { useState, useEffect } from 'react';

const Message = ({ message, type, duration = 5000 }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, duration);
            return () => clearTimeout(timer); // Clean up on unmount or message change
        } else {
            setIsVisible(false);
        }
    }, [message, duration]);

    if (!isVisible || !message) {
        return null;
    }

    const messageClass = `message ${type === 'error' ? 'error' : 'success'}`;

    return (
        <div className={messageClass}>
            {message}
          
        </div>
    );
};

export default Message;