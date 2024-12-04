import { useState, useCallback } from "react";
import { Auth } from 'aws-amplify';

export const useCreateAgent = () => {
    const [loading, setLoading] = useState(false);

    const createAgent = useCallback(
        async ({ agent_name, agent_description, prompt, is_public, org_id }) => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/agent`, {
                    method: 'POST',
                    headers: {
                        'Authorization': Auth.user.signInUserSession.accessToken.jwtToken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        agent_name,
                        agent_description,
                        prompt,
                        is_public,
                        org_id
                    })
                });

                if (!response.ok) throw new Error("Failed to create agent.");
                return await response.json();
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
        createAgent,
        loading,
    };
};