import { useState, useEffect, useCallback, useRef } from "react";
import { Auth } from 'aws-amplify';
import { createUrlParams } from "../../lib/helpers/CreateURLParams";

const createContextAPI = async ({ agent_id, invoke_agent_message }) => {
    try {
        const urlParams = createUrlParams({ agent_id, invoke_agent_message });
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/context${urlParams}`, {
            method: 'GET',
            headers: {
                'Authorization': Auth.user.signInUserSession.accessToken.jwtToken,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error("Failed to create context.");
        return await response.json();
    } catch (error) {
        const errorMessage = error.message || 'An unknown error occurred. Please try again.';
        throw Error(errorMessage);
    }
};

export const useCreateContext = ({ agent_id, invoke_agent_message }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [context, setContext] = useState(null);
    const loadInitiatedRef = useRef(false);

    useEffect(() => {
        if (loadInitiatedRef.current) return;
        loadInitiatedRef.current = true;
        createContext({ agent_id, invoke_agent_message });
    }, []);

    const createContext = async ({ agent_id, invoke_agent_message }) => {
        try {
            setLoading(true);
            const context = await createContextAPI({ agent_id, invoke_agent_message });
            setContext(context);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const clearError = useCallback(() => setError(null), []);

    return {
        context,
        error,
        loading,
        clearError
    };
};

export const useCreateContextLazy = () => {
    const [loading, setLoading] = useState(false);

    const createContext = useCallback(
        async ({ agent_id, invoke_agent_message }) => {
            try {
                setLoading(true);
                return await createContextAPI({ agent_id, invoke_agent_message });
            } catch (error) {
                throw error;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        createContext,
        loading
    };
}