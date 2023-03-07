import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

export interface IGlobalState {
    username: string;
    isAuthenticated: boolean;
    isSignInLoading: boolean;
    signInError: string;
    isSignUpLoading: boolean;
    signUpError: string;
}

const GlobalStateContext = createContext({
    state: {} as Partial<IGlobalState>,
    setState: {} as Dispatch<SetStateAction<Partial<IGlobalState>>>,
});

const GlobalStateProvider = ({
    children,
    value = {} as IGlobalState,
}: {
    children: ReactNode;
    value?: Partial<IGlobalState>;
}) => {
    const [state, setState] = useState(value);

    return (
        <GlobalStateContext.Provider value={{ state, setState }}>
            {children}
        </GlobalStateContext.Provider>
    );
};

const useGlobalState = () => {
    const context = useContext(GlobalStateContext);
    if (!context) {
        throw new Error("useGlobalState must be used within a GlobalStateContext");
    }

    return context;
};

export { GlobalStateProvider, useGlobalState };