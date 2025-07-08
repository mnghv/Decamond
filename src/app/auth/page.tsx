'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../../components/Input';
import Button from '../../components/Button';
import styles from '../../styles/Auth.module.scss';

interface User {
    name: {
        first: string;
        last: string;
    };
    email: string;
    picture: {
        large: string;
    };
    location: {
        city: string;
        country: string;
    };
}

interface ApiResponse {
    results: User[];
}

const AuthPage: React.FC = () => {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Iranian phone number validation
    const validateIranianPhone = (phone: string): boolean => {
        // Remove spaces and dashes
        const cleanPhone = phone.replace(/[\s-]/g, '');

        // Iranian phone number patterns
        const patterns = [
            /^09\d{9}$/, // Mobile: 09xxxxxxxxx
            /^\+989\d{9}$/, // Mobile with country code: +989xxxxxxxxx
            /^00989\d{9}$/, // Mobile with 00: 00989xxxxxxxxx
            /^0\d{10}$/, // Landline: 0xxxxxxxxxx
            /^\+98\d{10}$/, // Landline with country code: +98xxxxxxxxxx
            /^0098\d{10}$/, // Landline with 00: 0098xxxxxxxxxx
        ];

        return patterns.some((pattern) => pattern.test(cleanPhone));
    };

    const handlePhoneChange = (value: string) => {
        setPhoneNumber(value);
        setPhoneError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate phone number
        if (!phoneNumber.trim()) {
            setPhoneError('Phone number is required');
            return;
        }

        if (!validateIranianPhone(phoneNumber)) {
            setPhoneError('Invalid phone number');
            return;
        }

        setIsLoading(true);

        try {
            // Fetch random user from API
            const response = await fetch(
                'https://randomuser.me/api/?results=1&nat=us'
            );

            if (!response.ok) {
                throw new Error('Error fetching user data');
            }

            const data: ApiResponse = await response.json();
            const user = data.results[0];

            // Store user data in localStorage
            const userData = {
                name: `${user.name.first} ${user.name.last}`,
                email: user.email,
                avatar: user.picture.large,
                location: `${user.location.city}, ${user.location.country}`,
                phoneNumber: phoneNumber,
                loginTime: new Date().toISOString(),
            };
            console.log(userData);
            localStorage.setItem('userData', JSON.stringify(userData));

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            setPhoneError('Login error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Login</h1>
                    <p className={styles.subtitle}>
                        Please enter your phone number
                    </p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <Input
                        label='Phone Number'
                        type='tel'
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder='Example: 09123456789'
                        error={phoneError}
                        required
                        disabled={isLoading}
                    />

                    <Button
                        type='submit'
                        loading={isLoading}
                        disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;
