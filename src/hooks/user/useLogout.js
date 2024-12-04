import { useState, useCallback } from "react";
import { Auth } from 'aws-amplify';

export const useLogout = () => {
    const [loading, setLoading] = useState(false);

    const logout = useCallback(
        async () => {
            try {
                setLoading(true);
                await Auth.signOut();
            } catch (error) {
                const errorMessage = error.message || 'An unknown error occurred. Please try again.';
                throw Error(errorMessage);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        logout,
        loading,
    };
};
