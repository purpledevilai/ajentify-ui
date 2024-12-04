import React from 'react';

const LoadingShimmerBox = ({ height, width }) => {
    return (
        <div
            style={{
                ...styles.shimmerBox,
                height,
                width,
            }}
        >
            <div style={styles.shimmer}></div>
        </div>
    );
};

const styles = {
    shimmerBox: {
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#3c3c3c', // Darker gray background
        borderRadius: '4px',
    },
    shimmer: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        backgroundImage: 'linear-gradient(90deg, #3c3c3c 0%, #a0a0a0 50%, #3c3c3c 100%)', // Adjust gradient to match darker background
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
    },
};

// Keyframes for shimmer animation
const shimmerKeyframes = `
@keyframes shimmer {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(100%);
  }
}`;

// Inject the keyframes into the document
const injectKeyframes = () => {
    const styleSheet = document.styleSheets[0];
    const keyframeExists = Array.from(styleSheet.cssRules).some(
        (rule) => rule.name === 'shimmer'
    );
    if (!keyframeExists) {
        styleSheet.insertRule(shimmerKeyframes, styleSheet.cssRules.length);
    }
};

injectKeyframes();

export default LoadingShimmerBox;
