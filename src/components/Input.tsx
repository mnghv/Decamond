'use client';

import React from 'react';
import styles from '../styles/Auth.module.scss';

interface InputProps {
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    required = false,
    disabled = false,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={styles.formGroup}>
            <label className={styles.label}>
                {label}
                {required && (
                    <span style={{ color: 'hsl(0 84.2% 60.2%)' }}> *</span>
                )}
            </label>
            <input
                type={type}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`${styles.input} ${error ? styles.error : ''}`}
                required={required}
            />
            {error && (
                <div className={styles.errorMessage}>
                    <svg
                        width='12'
                        height='12'
                        viewBox='0 0 12 12'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'>
                        <path
                            d='M6 1C3.24 1 1 3.24 1 6s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 9c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z'
                            fill='currentColor'
                        />
                        <path
                            d='M6 3.5c.28 0 .5.22.5.5v2c0 .28-.22.5-.5.5s-.5-.22-.5-.5V4c0-.28.22-.5.5-.5z'
                            fill='currentColor'
                        />
                        <circle cx='6' cy='8' r='.5' fill='currentColor' />
                    </svg>
                    {error}
                </div>
            )}
        </div>
    );
};

export default Input;
