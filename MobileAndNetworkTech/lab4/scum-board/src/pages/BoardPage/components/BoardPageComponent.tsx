import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { BoardFull, Board } from "../../../domain/board";

import { useGlobalState } from "../../../utils/GlobalStateProvider";

type BoardPageComponentPropsType = {
    boardList: Array<Board>;
    board: BoardFull;
    onSelectBoard: (boardID: number) => void;
}

export const BoardPageComponent: React.FC<BoardPageComponentPropsType> = (props) => {
    const { state } = useGlobalState();

    const onSelectBoard = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const boardID = parseInt(event.target.value);

        console.log('selected board: ', boardID);

        props.onSelectBoard(boardID);
    };

    return (
        <div className="wrapper">
            <div className="container">
                <h3>Your boards</h3>
                <select
                    className="boards-select"
                    name="boards"
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => onSelectBoard(event)}
                >
                    {
                        props.boardList.map((board) => (
                            <option
                                key={`key-${board.boardID}`}
                                value={board.boardID}
                                selected={board.boardID === props.board.boardID}
                            >
                                {board.name}
                            </option>
                        ))
                    }
                </select>

                <div className="current-board">
                    <h3>{props.board.name}</h3>
                </div>
            </div>
        </div>
    );
};