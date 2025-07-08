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
            // Fetch random user from API with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            let response;
            try {
                response = await fetch(
                    'https://randomuser.me/api/?results=1&nat=us',
                    { signal: controller.signal }
                );
            } catch (fetchError) {
                clearTimeout(timeoutId);
                console.error('Network error:', fetchError);

                // Create fallback user data if API is unavailable
                const fallbackUserData = {
                    name: 'Demo User',
                    email: `user.${Date.now()}@example.com`,
                    avatar: 'https://via.placeholder.com/150/1f2937/ffffff?text=U',
                    location: 'Tehran, Iran',
                    phoneNumber: phoneNumber,
                    loginTime: new Date().toISOString(),
                };

                localStorage.setItem(
                    'userData',
                    JSON.stringify(fallbackUserData)
                );
                router.push('/dashboard');
                return;
            }

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
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

            // Provide more specific error messages
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    setPhoneError(
                        'Request timed out. Please check your connection and try again.'
                    );
                } else if (error.message.includes('HTTP error')) {
                    setPhoneError('Server error. Please try again later.');
                } else {
                    setPhoneError(
                        'Network error. Please check your connection and try again.'
                    );
                }
            } else {
                setPhoneError(
                    'An unexpected error occurred. Please try again.'
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            {/* Beautiful Header */}
            <header className={styles.authHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.logoSection}>
                        <div className={styles.logoIcon}>
                            <svg
                                width='32'
                                height='32'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    d='M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z'
                                    fill='currentColor'
                                />
                            </svg>
                        </div>
                        <div className={styles.logoText}>
                            <h1 className={styles.appTitle}>Decamond</h1>
                            <span className={styles.appSubtitle}>
                                Secure Authentication
                            </span>
                        </div>
                    </div>
                </div>
            </header>

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
