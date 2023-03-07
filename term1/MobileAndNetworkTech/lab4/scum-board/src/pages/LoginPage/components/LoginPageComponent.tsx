import React, { useState } from "react";

type LoginPageComponentPropsType = {
    onSignInHandler: (username: string, password: string) => void,
    isSignInLoading: boolean,
    signInError: string,
    onSignUpHandler: (username: string, password: string, repeatPassword: string) => void,
    isSignUpLoading: boolean,
    signUpError: string,
}

export const LoginPageComponent: React.FC<LoginPageComponentPropsType> = (props) => {
    const [isSignIn, setIsSignIn] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [repeatPassword, setRepeatPassword] = useState<string>("");
    const [isSubmitClicked, setIsSubmitClicked] = useState<boolean>(false);

    const signInForm = (
        <form>
            <input type="text" placeholder="Username" value={username} onChange={
                (event: React.FormEvent<HTMLInputElement>) => setUsername(event.currentTarget.value)
            }></input>
            <input type="password" placeholder="Password" value={password} onChange={
                (event: React.FormEvent<HTMLInputElement>) => setPassword(event.currentTarget.value)
            }></input>
            <p>Don't have an account? <span onClick={() => { setIsSignIn(false) }}>Sign Up</span></p>
            <button className="signin-button" onClick={(event: React.FormEvent<HTMLButtonElement>) => {
                event.preventDefault();
                props.onSignInHandler(username, password);
                setUsername("");
                setPassword("");
                setIsSubmitClicked(true);
            }}>Sign In</button>
            {
                !props.isSignInLoading && isSubmitClicked && props.signInError ?
                    <p>{props.signInError}</p>
                    :
                    <></>
            }
        </form>
    )

    const signUpForm = (
        <form>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={
                    (event: React.FormEvent<HTMLInputElement>) => setUsername(event.currentTarget.value)
                }
            ></input>
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={
                    (event: React.FormEvent<HTMLInputElement>) => setPassword(event.currentTarget.value)
                }
            ></input>
            <input
                type="password"
                placeholder="Repeat password"
                value={repeatPassword}
                onChange={
                    (event: React.FormEvent<HTMLInputElement>) => setRepeatPassword(event.currentTarget.value)
                }
            ></input>
            <p>Already have an account? <span onClick={() => { setIsSignIn(true) }}>Sign In</span></p>
            <button className="signup-button" onClick={(event: React.FormEvent<HTMLButtonElement>) => {
                event.preventDefault();
                props.onSignUpHandler(username, password, repeatPassword);
                setUsername("");
                setPassword("");
                setRepeatPassword("");
                setIsSubmitClicked(true);
            }}>Sign Up</button>
            {
                !props.isSignUpLoading && isSubmitClicked && props.signUpError ?
                    <p>{props.signUpError}</p>
                    :
                    <></>
            }
        </form>
    )

    return (
        <div className="login-form">
            <h1>Sign In!</h1>
            {
                isSignIn ?
                    signInForm
                    :
                    signUpForm
            }
        </div>
    );
};