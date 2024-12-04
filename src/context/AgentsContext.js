import React, { createContext, useState, useContext, useCallback, useRef } from "react";
import { useGetAgents } from "../hooks/agent/useGetAgents";

const AgentContext = createContext();

// Wraps your app
export const AgentContextProvider = ({ children }) => {

    const [agents, setAgents] = useState([]);
    const agentsLoadedRef = useRef(false);
    const { getAgents: hookGetAgents, loading: getAgentsLoading } = useGetAgents();

    const getAgents = useCallback(async (forceUpdate = false) => {
        if (agentsLoadedRef.current === false || forceUpdate) {
            const agents = await hookGetAgents();
            setAgents(agents);
        }
        agentsLoadedRef.current = true;
    }, [hookGetAgents]);

    return (
        <AgentContext.Provider value={{
            agents,
            getAgents,
            getAgentsLoading
        }}>
            {children}
        </AgentContext.Provider>
    )
};

// What you use
export const useAgentContext = () => useContext(AgentContext);
