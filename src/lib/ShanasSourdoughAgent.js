export class ShanasSourdoughAgent {
    constructor(convId = null) {
        this.name = 'Shana\'s Sourdough Agent';
        this.convId = convId;
        this.apiUrl = 'https://ovtuu968q1.execute-api.us-east-2.amazonaws.com/v1/ssd-chatbot';
        this.messages = [{ text: "Hello, how can I help you?", isUser: false }]; // Initial message
    }

    getName() {
        return this.name;
    }

    async sendMessage(message) {
        const postBody = {
            message: message
        };

        // Include convId in the request if it exists
        if (this.convId) {
            postBody.conv_id = this.convId;
        }

        try {
            // Send the message to the API
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
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
            this.convId = responseBody.conv_id;
            this.messages.push({ text: message, isUser: true });
            this.messages.push({ text: responseBody.response, isUser: false });

            return responseBody.response; // Return the successful response
        } catch (error) {
            console.error('Error sending message:', error);
            return { error: 'An unexpected error occurred. Please try again.' };
        }
    }

    getMessages() {
        return this.messages;
    }
}
