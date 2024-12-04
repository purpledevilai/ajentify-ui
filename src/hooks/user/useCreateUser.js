import { useState, useCallback } from "react";
import { Auth } from 'aws-amplify';

export const useCreateUser = () => {
    const [loading, setLoading] = useState(false);

    const createUser = useCallback(
        async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user`, {
                    method: 'POST',
                    headers: {
                        'Authorization': Auth.user.signInUserSession.accessToken.jwtToken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                });

                if (!response.ok) throw new Error("Failed to create user.");
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
        createUser,
        loading,
    };
};
