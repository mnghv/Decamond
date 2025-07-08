'use client';

import React from 'react';
import styles from '../styles/Auth.module.scss';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    loading?: boolean;
    variant?:
        | 'default'
        | 'destructive'
        | 'outline'
        | 'secondary'
        | 'ghost'
        | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    type = 'button',
    disabled = false,
    loading = false,
    variant = 'default',
    size = 'default',
    className = '',
}) => {
    const getButtonClass = () => {
        const baseClass = styles.submitButton;
        const variantClass =
            variant === 'destructive'
                ? styles.destructiveButton
                : variant === 'outline'
                ? styles.outlineButton
                : '';
        const sizeClass =
            size === 'sm'
                ? styles.smallButton
                : size === 'lg'
                ? styles.largeButton
                : '';
        return `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={getButtonClass()}>
            {loading && <span className={styles.loadingSpinner} />}
            {children}
        </button>
    );
};

export default Button;
