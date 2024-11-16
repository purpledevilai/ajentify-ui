import React, { createContext, useState, useContext, useCallback } from "react";
import { Auth } from 'aws-amplify';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    //const [agents] = useState([new DefaultAgent(), new ShanasSourdoughAgent()]);
    const [agents, setAgents] = useState([]);
    const [agentsLoading, setAgentsLoading] = useState(false);
    const [agentsError, setAgentsError] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [chatHistoryLoading, setChatHistoryLoading] = useState(false);
    const [chatHistoryError, setChatHistoryError] = useState(null);
    const [currentContext, setCurrentContext] = useState(null);
    const [contextLoading, setContextLoading] = useState(false);
    const [contextError, setContextError] = useState(null);

    const resetContext = () => {
        setIsLoggedIn(false);
        setAgents([]);
        setAgentsLoading(false);
        setAgentsError(null);
        setChatHistory([]);
        setChatHistoryLoading(false);
        setChatHistoryError(null);
        setCurrentContext(null);
        setContextLoading(false);
        setContextError(null);
    };

    const fetchAgents = useCallback(async () => {
        setAgentsLoading(true);
        setAgentsError(null);
        try {
            const token = Auth.user.signInUserSession.accessToken.jwtToken;
            const response = await fetch(`${BASE_URL}/agents`, {
                headers: { Authorization: token },
            });

            if (!response.ok) throw new Error("Failed to load agents.");

            const data = await response.json();
            setAgents(data);
        } catch (error) {
            setAgentsError(error.message);
        } finally {
            setAgentsLoading(false);
        }
    }, []);

    const fetchChatHistory = useCallback(async () => {
        setChatHistoryLoading(true);
        setChatHistoryError(null);
        try {
            const token = Auth.user.signInUserSession.accessToken.jwtToken;
            const response = await fetch(`${BASE_URL}/chat-history`, {
                headers: { Authorization: token },
            });

            if (!response.ok) throw new Error("Failed to load chat history.");

            const data = await response.json();
            setChatHistory(data.chat_history);
        } catch (error) {
            setChatHistoryError(error.message);
        } finally {
            setChatHistoryLoading(false);
        }
    }, []);

    const fetchContext = useCallback(async (contextId = null) => {
        setContextLoading(true);
        setContextError(null);
        try {
            var url = `${BASE_URL}/context`;
            if (contextId) {
                url = `${url}?context_id=${contextId}`;
            }
            const token = Auth.user.signInUserSession.accessToken.jwtToken;
            const response = await fetch(url, {
                headers: { Authorization: token },
            });
            if (!response.ok) throw new Error("Failed to load conversation context.");

            const data = await response.json();
            setCurrentContext(data);
        } catch (error) {
            setContextError(error.message);
        } finally {
            setContextLoading(false);
        }
    }, []);

    return (
        <AppContext.Provider value={{
            isLoggedIn,
            setIsLoggedIn,
            fetchAgents,
            agents,
            agentsLoading,
            agentsError,
            fetchChatHistory,
            chatHistory,
            chatHistoryLoading,
            chatHistoryError,
            fetchContext,
            currentContext,
            contextLoading,
            contextError,
            resetContext
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
