import React, { createContext, useState, useContext, useCallback } from "react";
import { DefaultAgent } from "../lib/DefaultAgent";
import { ShanasSourdoughAgent } from "../lib/ShanasSourdoughAgent";
import { Auth } from 'aws-amplify';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [agents] = useState([new DefaultAgent(), new ShanasSourdoughAgent()]);
    const [chatHistory, setChatHistory] = useState([]);
    const [chatHistoryLoading, setChatHistoryLoading] = useState(false);
    const [chatHistoryError, setChatHistoryError] = useState(null);

    const fetchChatHistory = useCallback(async () => {
        setChatHistoryLoading(true);
        setChatHistoryError(null);
        try {
            const token = Auth.user.signInUserSession.accessToken.jwtToken;
            const response = await fetch('https://20yz4xw0ib.execute-api.ap-southeast-4.amazonaws.com/v1/chat-history', {
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
    }, []); // Empty dependency array ensures it only changes if dependencies change

    return (
        <AppContext.Provider value={{
            isLoggedIn,
            setIsLoggedIn,
            agents,
            chatHistory,
            chatHistoryLoading,
            chatHistoryError,
            fetchChatHistory
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
