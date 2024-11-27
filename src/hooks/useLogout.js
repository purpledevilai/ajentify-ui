import { useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';

export const useLogout = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const logout = useCallback(
        async () => {
            console.log("Calling logout");
            try {
                setLoading(true);
                setError(null);
                await Auth.signOut();
                navigate('/login');
            } catch (error) {
                setError(error.message || 'An unknown error occurred. Please try again.');
            } finally {
                setLoading(false);
            }
        },
        [navigate]
    );

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        logout,
        loading,
        error,
        clearError,
    };
};
