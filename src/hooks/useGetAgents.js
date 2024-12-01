import { useState, useCallback } from "react";
import { Auth } from 'aws-amplify';

export const useGetAgents = () => {
    const [loading, setLoading] = useState(false);

    const getAgents = useCallback(
        async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/agents`, {
                    headers: {
                        'Authorization': Auth.user.signInUserSession.accessToken.jwtToken,
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) throw new Error("Failed to get agents.");
                const agentsData = await response.json();
                console.log(agentsData)

                return agentsData;
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
        getAgents,
        loading,
    };
};
