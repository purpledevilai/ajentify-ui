import { useState, useCallback } from "react";
import { Auth } from 'aws-amplify';

export const useConfirmSignUp = () => {
    const [loading, setLoading] = useState(false);

    const confirmSignUp = useCallback(
        async ({ email, verificationCode }) => {
            try {
                setLoading(true);
                await Auth.confirmSignUp(email, verificationCode);
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
        confirmSignUp,
        loading,
    };
};
