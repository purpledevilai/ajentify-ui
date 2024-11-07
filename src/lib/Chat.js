var convId = null;
export const sendMessage = async (message) => {
    var postBody = {
        message: message
    }

    if (convId) {
        postBody.conv_id = convId;
    }

    const response = await fetch('https://ovtuu968q1.execute-api.us-east-2.amazonaws.com/v1/ssd-chatbot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postBody)
    });

    const responseBody = await response.json();

    convId = responseBody.conv_id;

    return responseBody.response;
}