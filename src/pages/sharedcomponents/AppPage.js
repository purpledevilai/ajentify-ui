import React from 'react';
import { colors } from './SharedStyles';

const AppPage = ({ children, style }) => {
    return (
        <div style={{ ...styles.container, ...style }}>
            {children}
        </div>
    );
};

const styles = {
    container: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colors.background,
        color: colors.text,
        overflow: 'auto',
        position: 'fixed',
    },
};

export default AppPage;
