import { useState, useCallback } from "react";
import { Auth } from 'aws-amplify';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);

    const login = useCallback(
        async ({ email, password }) => {
            try {
                setLoading(true);
                await Auth.signIn(email, password);
            } catch (error) {
                const errorMessage = error.message || 'An unknown error occurred. Please try again.';
                throw Error(errorMessage);
            } finally {
                setLoading(false)
            }
        },
        []
    );

    return {
        login,
        loading
    };
};
