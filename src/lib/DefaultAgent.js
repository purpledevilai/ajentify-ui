import { Auth } from 'aws-amplify';

export class DefaultAgent {
    constructor(convId = null) {
        this.name = 'Default Agent';
        this.convId = convId;
        this.apiUrl = 'https://20yz4xw0ib.execute-api.ap-southeast-4.amazonaws.com/v1/chat';
        this.messages = []; // Initial message
    }

    getName() {
        return this.name;
    }

    async sendMessage(message) {
        const postBody = { message: message };

        // Include convId in the request if it exists
        if (this.convId) {
            postBody.context_id = this.convId;
        }

        try {
            // Send the message to the API
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': Auth.user.signInUserSession.accessToken.jwtToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postBody)
            });

            // Parse the JSON response
            const responseBody = await response.json();

            // Check if there's an error in the response
            if (responseBody.error) {
                return responseBody; // Return the error response
            }

            // If no error, update the convId and add the response to messages
            this.convId = responseBody.context_id;
            this.messages.push({ text: message, isUser: true });
            this.messages.push({ text: responseBody.response, isUser: false });

            return responseBody; // Return the successful response
        } catch (error) {
            console.error('Error sending message:', error);
            return { error: 'An unexpected error occurred. Please try again.' };
        }
    }

    getMessages() {
        return this.messages;
    }
}
