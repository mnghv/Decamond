'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Button from '../../components/Button';
import HamburgerMenu from '../../components/HamburgerMenu';
import styles from '../../styles/Dashboard.module.scss';
import { useAuth, UserData } from '../../utils/authUtils';
import Image from 'next/image';

const DashboardPage: React.FC = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sessionDuration, setSessionDuration] = useState<string>('');
    const { checkAuth, logout, redirectToAuth } = useAuth();

    // Memoize user data to prevent unnecessary re-renders
    const memoizedUserData = useMemo(() => {
        return checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (memoizedUserData) {
            setUserData(memoizedUserData);
            setIsLoading(false);
        } else {
            // Handle navigation in useEffect instead of during render
            redirectToAuth();
        }
    }, [memoizedUserData, redirectToAuth]);

    // Calculate session duration with optimized timer
    useEffect(() => {
        if (!userData?.loginTime) return;

        const updateSessionDuration = () => {
            const loginTime = new Date(userData.loginTime).getTime();
            const now = Date.now();
            const diff = now - loginTime;

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setSessionDuration(
                `${hours.toString().padStart(2, '0')}:${minutes
                    .toString()
                    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        };

        // Update immediately
        updateSessionDuration();

        // Set up interval
        const interval = setInterval(updateSessionDuration, 1000);

        // Cleanup interval on unmount or userData change
        return () => {
            clearInterval(interval);
        };
    }, [userData?.loginTime]);

    const handleLogout = () => {
        logout();
    };

    if (isLoading) {
        return (
            <div className={styles.dashboardContainer}>
                <div className={styles.dashboardCard}>
                    <div className={styles.loadingState}>
                        <div className={styles.loadingSpinner}></div>
                        <p className={styles.loadingText}>Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!userData) {
        return null; // Will redirect to auth page
    }

    // Calculate date information
    const loginDate = new Date(userData.loginTime);
    const now = new Date();
    const isToday = now.toDateString() === loginDate.toDateString();
    const isThisWeek =
        now.getTime() - loginDate.getTime() < 7 * 24 * 60 * 60 * 1000;

    return (
        <div className={styles.dashboardContainer}>
            {/* Beautiful Header */}
            <header className={styles.dashboardHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.headerLeft}>
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
                                    User Dashboard
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.headerCenter}>
                        <div className={styles.welcomeMessage}>
                            <span className={styles.welcomeText}>
                                Welcome back,
                            </span>
                            <span className={styles.userName}>
                                {userData.name}
                            </span>
                        </div>
                    </div>

                    <div className={styles.headerRight}>
                        <div className={styles.userMenu}>
                            <div className={styles.userAvatar}>
                                <Image
                                    src={userData.avatar}
                                    alt='User avatar'
                                    width={32}
                                    height={32}
                                />
                            </div>

                            {/* Desktop logout button - hidden in mobile */}
                            <div className={styles.logoutSection}>
                                <Button
                                    onClick={handleLogout}
                                    variant='outline'
                                    size='sm'
                                    className={styles.logoutButton}>
                                    <svg
                                        width='16'
                                        height='16'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        xmlns='http://www.w3.org/2000/svg'>
                                        <path
                                            d='M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z'
                                            fill='currentColor'
                                        />
                                    </svg>
                                    Logout
                                </Button>
                            </div>

                            {/* Mobile hamburger menu */}
                            <HamburgerMenu onLogout={handleLogout} />
                        </div>
                    </div>
                </div>
            </header>

            <div className={styles.dashboardCard}>
                <div className={styles.userSection}>
                    <div className={styles.userCard}>
                        <div className={styles.userHeader}>
                            <div className={styles.avatarSection}>
                                <Image
                                    src={userData.avatar}
                                    alt='User image'
                                    className={styles.userAvatar}
                                    width={32}
                                    height={32}
                                />
                                <div className={styles.statusIndicator}>
                                    <div className={styles.statusDot}></div>
                                </div>
                            </div>
                            <div className={styles.userInfo}>
                                <h2 className={styles.userName}>
                                    {userData.name}
                                </h2>
                                <p className={styles.userEmail}>
                                    {userData.email}
                                </p>
                                <div className={styles.accountStatus}>
                                    <span className={styles.statusBadge}>
                                        Active Account
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.userDetails}>
                            <div className={styles.detailItem}>
                                <div className={styles.detailIcon}>
                                    <svg
                                        width='16'
                                        height='16'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        xmlns='http://www.w3.org/2000/svg'>
                                        <path
                                            d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'
                                            fill='currentColor'
                                        />
                                    </svg>
                                </div>
                                <div className={styles.detailContent}>
                                    <span className={styles.detailLabel}>
                                        Location
                                    </span>
                                    <span className={styles.detailValue}>
                                        {userData.location}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.detailItem}>
                                <div className={styles.detailIcon}>
                                    <svg
                                        width='16'
                                        height='16'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        xmlns='http://www.w3.org/2000/svg'>
                                        <path
                                            d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'
                                            fill='currentColor'
                                        />
                                    </svg>
                                </div>
                                <div className={styles.detailContent}>
                                    <span className={styles.detailLabel}>
                                        Phone Number
                                    </span>
                                    <span className={styles.detailValue}>
                                        {userData.phoneNumber}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.detailItem}>
                                <div className={styles.detailIcon}>
                                    <svg
                                        width='16'
                                        height='16'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        xmlns='http://www.w3.org/2000/svg'>
                                        <path
                                            d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
                                            fill='currentColor'
                                        />
                                    </svg>
                                </div>
                                <div className={styles.detailContent}>
                                    <span className={styles.detailLabel}>
                                        Login Time
                                    </span>
                                    <span className={styles.detailValue}>
                                        {loginDate.toLocaleString('en-US')}
                                        {isToday && (
                                            <span className={styles.todayBadge}>
                                                Today
                                            </span>
                                        )}
                                        {isThisWeek && !isToday && (
                                            <span className={styles.weekBadge}>
                                                This Week
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.detailItem}>
                                <div className={styles.detailIcon}>
                                    <svg
                                        width='16'
                                        height='16'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        xmlns='http://www.w3.org/2000/svg'>
                                        <path
                                            d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
                                            fill='currentColor'
                                        />
                                    </svg>
                                </div>
                                <div className={styles.detailContent}>
                                    <span className={styles.detailLabel}>
                                        Session Duration
                                    </span>
                                    <span className={styles.detailValue}>
                                        <span className={styles.sessionTimer}>
                                            {sessionDuration}
                                        </span>
                                        <span className={styles.sessionLabel}>
                                            Hours:Minutes:Seconds
                                        </span>
                                    </span>
                                </div>
                            </div>

                            <div className={styles.detailItem}>
                                <div className={styles.detailIcon}>
                                    <svg
                                        width='16'
                                        height='16'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        xmlns='http://www.w3.org/2000/svg'>
                                        <path
                                            d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z'
                                            fill='currentColor'
                                        />
                                    </svg>
                                </div>
                                <div className={styles.detailContent}>
                                    <span className={styles.detailLabel}>
                                        Security Status
                                    </span>
                                    <span className={styles.detailValue}>
                                        <span className={styles.securityStatus}>
                                            Account Protected
                                        </span>
                                        <span className={styles.securityIcon}>
                                            🔒
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
