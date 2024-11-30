import { useState, useCallback } from "react";
import { Auth } from 'aws-amplify';

export const useCreateOrganization = () => {
    const [loading, setLoading] = useState(false);

    const createOrganization = useCallback(
        async ({ organizationName }) => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/organization`, {
                    method: 'POST',
                    headers: {
                        'Authorization': Auth.user.signInUserSession.accessToken.jwtToken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: organizationName
                    })
                });

                if (!response.ok) throw new Error("Failed to create organization.");
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
        createOrganization,
        loading,
    };
};