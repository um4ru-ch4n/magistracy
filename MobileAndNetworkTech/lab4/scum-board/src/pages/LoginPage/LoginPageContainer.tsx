import React from "react";
import { AuthAPI } from "../../api/authAPI";
import { SaveToken, SaveUserName } from "../../utils/authUtils";
import { useGlobalState } from "../../utils/GlobalStateProvider";

import { LoginPageComponent } from "./components/LoginPageComponent";

export const LoginPage: React.FC = () => {
    const { state, setState } = useGlobalState();

    const onSignInHandler = (username: string, password: string) => {
        setState(prev => ({
            ...prev,
            isSignInLoading: true,
        }));

        AuthAPI.signIn(username, password)
            .then(res => {
                if (res.error && res.error !== '') {
                    setState(prev => ({
                        ...prev,
                        signInError: res.error,
                    }));

                    return;
                }

                if (res.data && res.data.token) {
                    SaveToken(res.data.token);
                    SaveUserName(username);
                    setState(prev => ({
                        ...prev,
                        username: username,
                        isAuthenticated: true,
                        signInError: '',
                    }));
                }
            })
            .catch(err => {
                setState(prev => ({
                    ...prev,
                    signUpError: err.message,
                }));
            })
            .finally(() => {
                setState(prev => ({
                    ...prev,
                    isSignInLoading: false,
                }));
            })
    }

    const onSignUpHandler = async (username: string, password: string, repeatPassword: string) => {
        if (password !== repeatPassword) {
            setState(prev => ({
                ...prev,
                signUpError: 'Password must be equal to repeat password',
            }));

            return
        }

        setState(prev => ({
            ...prev,
            isSignUpLoading: true,
        }));

        AuthAPI.signUp(username, password)
            .then(res => {
                if (res.error && res.error !== '') {
                    setState(prev => ({
                        ...prev,
                        signUpError: res.error,
                    }));

                    return;
                }

                setState(prev => ({
                    ...prev,
                    signUpError: '',
                }));
            })
            .catch(err => {
                setState(prev => ({
                    ...prev,
                    signUpError: err.response.data.error,
                }));
            })
            .finally(() => {
                setState(prev => ({
                    ...prev,
                    isSignUpLoading: false,
                }));
            })
    }

    return (
        <LoginPageComponent
            isSignInLoading={state.isSignInLoading || false}
            isSignUpLoading={state.isSignUpLoading || false}
            signInError={state.signInError || ''}
            signUpError={state.signUpError || ''}
            onSignInHandler={onSignInHandler}
            onSignUpHandler={onSignUpHandler}
        />
    );
};