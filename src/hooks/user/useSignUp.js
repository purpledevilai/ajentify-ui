import { useState, useCallback } from "react";
import { Auth } from 'aws-amplify';

export const useSignUp = () => {
    const [loading, setLoading] = useState(false);

    const signUp = useCallback(
        async ({ email, password, firstName, lastName }) => {
            try {
                setLoading(true);
                return await Auth.signUp({
                    username: email,
                    password,
                    attributes: {
                        email,
                        given_name: firstName,
                        family_name: lastName,
                    },
                });
            } catch (error) {
                const errorMessage = error.message || 'An unknown error occurred. Please try again.';
                throw Error(errorMessage);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        signUp,
        loading,
    };
};
