import { Auth } from 'aws-amplify';

export const sendMessage = async (contextId, message) => {
    const postBody = { 
        context_id: contextId,
        message 
    };

    try {
        // Send the message to the API
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Authorization': Auth.user.signInUserSession.accessToken.jwtToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postBody)
        });

        // Parse the JSON response
        const responseBody = await response.json();

        return responseBody;

    } catch (error) {
        console.error('Error sending message:', error);
        return { error: 'An unexpected error occurred. Please try again.' };
    }
}