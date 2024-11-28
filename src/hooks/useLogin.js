import { useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const login = useCallback(
        async (email, password) => {
            try {
                setLoading(true);
                setError(null);
                await Auth.signIn(email, password);
                navigate('/');
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
        login,
        loading,
        error,
        clearError,
    };
};
