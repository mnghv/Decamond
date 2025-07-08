'use client';

import React, { useState, useEffect } from 'react';
import styles from '../styles/Dashboard.module.scss';
import { useAuth, UserData } from '../utils/authUtils';
import Image from 'next/image';

interface HamburgerMenuProps {
    onLogout: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const { checkAuth } = useAuth();

    useEffect(() => {
        const data = checkAuth();
        setUserData(data);
    }, [checkAuth]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        onLogout();
        setIsOpen(false);
    };

    // If no user data, don't render the menu
    if (!userData) {
        return null;
    }

    return (
        <div className={styles.hamburgerMenu}>
            {/* Hamburger Button */}
            <button
                className={`${styles.hamburgerButton} ${
                    isOpen ? styles.active : ''
                }`}
                onClick={toggleMenu}
                aria-label='Toggle menu'>
                <span className={styles.hamburgerLine}></span>
                <span className={styles.hamburgerLine}></span>
                <span className={styles.hamburgerLine}></span>
            </button>

            {/* Overlay */}
            {isOpen && (
                <div className={styles.menuOverlay} onClick={toggleMenu}></div>
            )}

            {/* Menu Content */}
            <div
                className={`${styles.menuContent} ${
                    isOpen ? styles.open : ''
                }`}>
                <div className={styles.menuHeader}>
                    <div className={styles.companyInfo}>
                        <div className={styles.logoSection}>
                            <div className={styles.logoIcon}>
                                <svg
                                    width='24'
                                    height='24'
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
                                <h3 className={styles.companyName}>Decamond</h3>
                                <span className={styles.companySubtitle}>
                                    User Dashboard
                                </span>
                            </div>
                        </div>
                    </div>
                    <button className={styles.closeButton} onClick={toggleMenu}>
                        <svg
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'>
                            <path
                                d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                                fill='currentColor'
                            />
                        </svg>
                    </button>
                </div>

                <div className={styles.menuItems}>
                    <div className={styles.menuItem}>
                        <div className={styles.menuItemIcon}>
                            <svg
                                width='20'
                                height='20'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'
                                    fill='currentColor'
                                />
                            </svg>
                        </div>
                        <span className={styles.menuItemText}>
                            User Profile
                        </span>
                    </div>

                    <div className={styles.menuItem}>
                        <div className={styles.menuItemIcon}>
                            <svg
                                width='20'
                                height='20'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
                                    fill='currentColor'
                                />
                            </svg>
                        </div>
                        <span className={styles.menuItemText}>Settings</span>
                    </div>

                    <div className={styles.menuItem}>
                        <div className={styles.menuItemIcon}>
                            <svg
                                width='20'
                                height='20'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z'
                                    fill='currentColor'
                                />
                            </svg>
                        </div>
                        <span className={styles.menuItemText}>Security</span>
                    </div>

                    <div className={styles.menuDivider}></div>

                    <div
                        className={`${styles.menuItem} ${styles.logoutItem}`}
                        onClick={handleLogout}>
                        <div className={styles.menuItemIcon}>
                            <svg
                                width='20'
                                height='20'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    d='M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z'
                                    fill='currentColor'
                                />
                            </svg>
                        </div>
                        <span className={styles.menuItemText}>Logout</span>
                    </div>
                </div>

                {/* User Profile Section at Bottom */}
                <div className={styles.menuFooter}>
                    <div className={styles.userProfile}>
                        <div className={styles.userAvatar}>
                            <Image
                                src={userData.avatar}
                                alt='User image'
                                className={styles.userAvatar}
                                width={32}
                                height={32}
                            />
                        </div>
                        <div className={styles.userInfo}>
                            <h4 className={styles.userName}>{userData.name}</h4>
                            <p className={styles.userEmail}>{userData.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HamburgerMenu;
