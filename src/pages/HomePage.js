import React, { useEffect } from "react";
import AppPage from "./components/AppPage";
import Header from "./components/Header";
import LoadingShimmerBox from "./components/LoadingShimmerBox";
import { useAgentContext } from "../context/AgentsContext";
import { colors } from "./components/SharedStyles";

const HomePage = () => {
  const { agents, getAgents, getAgentsLoading } = useAgentContext();

  useEffect(() => {
    getAgents();
  }, []);

  return (
    <AppPage>
      <Header />
      <div style={styles.homePageContainer}>
        <h1>Agents</h1>
        {getAgentsLoading ? (
          <LoadingShimmerBox height={100} width={200} />
        ) : (
          !agents ? (
            <h2>No agents</h2>
          ) : (
            <div style={styles.agentsContainer}>
              <button style={styles.addAgentCard} onClick={() => alert('Add Agent')}>
                <div style={styles.addIcon}>+</div>
                <p>Add Agent</p>
              </button>
              {agents.map((agent) => (
                <div key={agent.agent_id} style={styles.agentCard}>
                  <h3>{agent.agent_name}</h3>
                  <p>{agent.agent_description}</p>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </AppPage>
  );
};

const styles = {
  homePageContainer: {
    padding: '20px',
  },
  agentsContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    overflowX: 'auto', // Enable horizontal scrolling
    padding: '10px',
  },
  agentCard: {
    flex: '0 0 300px', // Maintain fixed width for each card
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: colors.cardColor,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  addAgentCard: {
    flex: '0 0 150px', // Same size as the agent cards
    padding: '20px',
    border: '1px #ccc', // Dashed border for "Add Agent"
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    cursor: 'pointer',
    color: '#333',
    textAlign: 'center',
  },
  addIcon: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
};

export default HomePage;
