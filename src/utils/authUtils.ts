import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export interface UserData {
    name: string;
    email: string;
    avatar: string;
    location: string;
    phoneNumber: string;
    loginTime: string;
}

export const useAuth = () => {
    const router = useRouter();

    const checkAuth = useCallback((): UserData | null => {
        // Check if we're on the client side
        if (typeof window === 'undefined') {
            return null;
        }

        // Check if user is authenticated
        const storedUserData = localStorage.getItem('userData');

        if (!storedUserData) {
            return null; // Don't navigate here, let components handle it
        }

        try {
            const parsedUserData: UserData = JSON.parse(storedUserData);
            return parsedUserData;
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('userData');
            return null; // Don't navigate here, let components handle it
        }
    }, []);

    const logout = useCallback(() => {
        // Check if we're on the client side
        if (typeof window === 'undefined') {
            return;
        }

        localStorage.removeItem('userData');
        router.push('/auth');
    }, [router]);

    const redirectToAuth = useCallback(() => {
        router.push('/auth');
    }, [router]);

    return {
        checkAuth,
        logout,
        redirectToAuth,
    };
};
