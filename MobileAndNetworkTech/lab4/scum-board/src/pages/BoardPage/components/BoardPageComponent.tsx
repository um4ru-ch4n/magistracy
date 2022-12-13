import React, {useState} from "react";
import { useGlobalState } from "../../../utils/GlobalStateProvider";

type BoardPageComponentPropsType = {

}

export const BoardPageComponent: React.FC<BoardPageComponentPropsType> = (props) => {
    const {state} = useGlobalState();

    return (
        <div>
            <h1>Your Board</h1>
            <h3>Your username: {state.username}</h3>
            <h3>IsAuthenticated: {state.isAuthenticated ? 'true' : 'false'}</h3>
        </div>
    );
};