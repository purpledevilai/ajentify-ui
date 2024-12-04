import { Auth } from "aws-amplify";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const createUser = async (userId) => {
    const response = await fetch(`${BASE_URL}/user`, {
        method: 'POST',
        headers: {
            'Authorization': Auth.user.signInUserSession.accessToken.jwtToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });

    if (!response.ok) throw new Error("Failed to create user.");
};