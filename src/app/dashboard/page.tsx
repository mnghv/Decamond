'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import styles from '../../styles/Dashboard.module.scss';

interface UserData {
    name: string;
    email: string;
    avatar: string;
    location: string;
    phoneNumber: string;
    loginTime: string;
}

const DashboardPage: React.FC = () => {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sessionDuration, setSessionDuration] = useState<string>('');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    useEffect(() => {
        // Check if user is authenticated
        const storedUserData = localStorage.getItem('userData');

        if (!storedUserData) {
            // Redirect to auth page if no user data
            router.push('/auth');
            return;
        }

        try {
            const parsedUserData: UserData = JSON.parse(storedUserData);
            setUserData(parsedUserData);
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('userData');
            router.push('/auth');
            return;
        }

        setIsLoading(false);
    }, [router]);

    // Calculate session duration
    useEffect(() => {
        if (userData) {
            const updateSessionDuration = () => {
                const loginTime = new Date(userData.loginTime).getTime();
                const now = new Date().getTime();
                const diff = now - loginTime;

                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor(
                    (diff % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                setSessionDuration(
                    `${hours.toString().padStart(2, '0')}:${minutes
                        .toString()
                        .padStart(2, '0')}:${seconds
                        .toString()
                        .padStart(2, '0')}`
                );
            };

            updateSessionDuration();
            const interval = setInterval(updateSessionDuration, 1000);
            return () => clearInterval(interval);
        }
    }, [userData]);

    const handleLogout = () => {
        if (showLogoutConfirm) {
            localStorage.removeItem('userData');
            router.push('/auth');
        } else {
            setShowLogoutConfirm(true);
            setTimeout(() => setShowLogoutConfirm(false), 3000);
        }
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    if (isLoading) {
        return (
            <div className={styles.dashboardContainer}>
                <div className={styles.dashboardCard}>
                    <div className={styles.loadingState}>
                        <div className={styles.loadingSpinner}></div>
                        <p className={styles.loadingText}>در حال بارگذاری...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!userData) {
        return null; // Will redirect to auth page
    }

    const loginDate = new Date(userData.loginTime);
    const isToday = new Date().toDateString() === loginDate.toDateString();
    const isThisWeek =
        new Date().getTime() - loginDate.getTime() < 7 * 24 * 60 * 60 * 1000;

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.dashboardCard}>
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>داشبورد کاربری</h1>
                        <p className={styles.subtitle}>
                            مدیریت حساب کاربری و اطلاعات شخصی
                        </p>
                    </div>
                    <div className={styles.logoutSection}>
                        {showLogoutConfirm ? (
                            <div className={styles.logoutConfirm}>
                                <span className={styles.confirmText}>
                                    آیا مطمئن هستید؟
                                </span>
                                <div className={styles.confirmButtons}>
                                    <Button
                                        onClick={handleLogout}
                                        variant='destructive'
                                        size='sm'
                                        className={styles.confirmButton}>
                                        بله، خروج
                                    </Button>
                                    <Button
                                        onClick={cancelLogout}
                                        variant='outline'
                                        size='sm'
                                        className={styles.cancelButton}>
                                        انصراف
                                    </Button>
                                </div>
                            </div>
                        ) : (
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
                                خروج از سیستم
                            </Button>
                        )}
                    </div>
                </div>

                <div className={styles.userSection}>
                    <div className={styles.userCard}>
                        <div className={styles.userHeader}>
                            <div className={styles.avatarSection}>
                                <img
                                    src={userData.avatar}
                                    alt='تصویر کاربر'
                                    className={styles.userAvatar}
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
                                        حساب فعال
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
                                        موقعیت جغرافیایی
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
                                        شماره تماس
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
                                        زمان ورود
                                    </span>
                                    <span className={styles.detailValue}>
                                        {loginDate.toLocaleString('fa-IR')}
                                        {isToday && (
                                            <span className={styles.todayBadge}>
                                                امروز
                                            </span>
                                        )}
                                        {isThisWeek && !isToday && (
                                            <span className={styles.weekBadge}>
                                                این هفته
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
                                        مدت زمان نشست
                                    </span>
                                    <span className={styles.detailValue}>
                                        <span className={styles.sessionTimer}>
                                            {sessionDuration}
                                        </span>
                                        <span className={styles.sessionLabel}>
                                            ساعت:دقیقه:ثانیه
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
                                        وضعیت امنیت
                                    </span>
                                    <span className={styles.detailValue}>
                                        <span className={styles.securityStatus}>
                                            حساب محافظت شده
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
