import { useState, useCallback } from "react";
import { Auth } from 'aws-amplify';

export const useUpdateAgent = () => {
    const [loading, setLoading] = useState(false);

    const updateAgent = useCallback(
        async ({ agent_id, agent_name, agent_description, prompt, is_public }) => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/agent`, {
                    method: 'POST',
                    headers: {
                        'Authorization': Auth.user.signInUserSession.accessToken.jwtToken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        agent_id,
                        agent_name,
                        agent_description,
                        prompt,
                        is_public
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
        updateAgent,
        loading,
    };
};