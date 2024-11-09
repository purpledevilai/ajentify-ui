import React, { createContext, useState, useContext } from "react";
import { DefaultAgent } from "../lib/DefaultAgent";
import { ShanasSourdoughAgent } from "../lib/ShanasSourdoughAgent";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [agents, setAgents] = useState([new DefaultAgent(), new ShanasSourdoughAgent()]);

    return (
        <AppContext.Provider value={{
            isLoggedIn,
            setIsLoggedIn,
            agents
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
