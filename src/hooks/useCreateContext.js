import { useState, useEffect, useCallback } from "react";
import { Auth } from 'aws-amplify';
import { createUrlParams } from "../lib/helpers/CreateURLParams";

export const useCreateContext = ({ agent_id, invoke_agent_message }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [context, setContext] = useState(null);

    useEffect(() => {
        createContext({ agent_id, invoke_agent_message });
    }, []);

    const createContext = async ({ agent_id, invoke_agent_message }) => {
        try {
            setLoading(true);
            const urlParams = createUrlParams({ agent_id, invoke_agent_message });
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/context${urlParams}`, {
                method: 'GET',
                headers: {
                    'Authorization': Auth.user.signInUserSession.accessToken.jwtToken,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error("Failed to create context.");
            setContext(await response.json());
        } catch (error) {
            const errorMessage = error.message || 'An unknown error occurred. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const clearError = useCallback(() => setError(null), []);

    return {
        context,
        error,
        loading,
        clearError
    };
};