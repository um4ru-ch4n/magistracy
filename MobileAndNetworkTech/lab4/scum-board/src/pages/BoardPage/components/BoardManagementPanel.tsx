import React, { useEffect, useState } from "react";
import { BoardFull, Board, Column } from "../../../domain/board";

type BoardManagementPanelPropsType = {
    boardList: Array<Board>;
    board: BoardFull;
    onSelectBoard: (boardID: number) => void;
    renameBoard: (newBoardName: string, boardID: number) => void;
    createBoard: (newBoardName: string) => void;
    columnCreate: (column: Column) => void;
    deleteBoard: (boardID: number) => void;
}

export const BoardManagementPanel: React.FC<BoardManagementPanelPropsType> = (props) => {
    const [selectedBoardID, setSelectedBoardID] = useState<number>(0);

    const [newBoardName, setNewBoardName] = useState<string>("");
    const [showBoardInput, setShowBoardInput] = useState<{ "isShown": boolean, "isEdit": boolean }>({ isShown: false, isEdit: false });

    const [newColumnCreate, setNewColumnCreate] = useState<Column>({
        boardID: props.board.boardID,
        columnID: 0,
        name: "",
        order: props.board.columns ? props.board.columns.length + 1 : 1,
    });

    useEffect(() => {
        if (props.board) {
            setSelectedBoardID(props.board.boardID);
        }
    }, [props.boardList])

    useEffect(() => {
        setNewColumnCreate({
            boardID: props.board.boardID,
            columnID: 0,
            name: "",
            order: props.board.columns ? props.board.columns.length + 1 : 1,
        })
    }, [props.board.columns]);

    const onSelectBoard = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const boardID = parseInt(event.target.value);
        setSelectedBoardID(boardID);

        props.onSelectBoard(boardID);
    };

    const onEditClickHandler = () => {
        if (!props.board) {
            return;
        }

        if (!showBoardInput.isShown) {
            setShowBoardInput({
                isEdit: true,
                isShown: true,
            })

            setNewBoardName(props.board.name);

            return;
        }

        props.renameBoard(newBoardName, props.board.boardID);
        setShowBoardInput({
            isEdit: false,
            isShown: false,
        })
    }

    const onCreateClickHandler = () => {
        if (!showBoardInput.isShown) {
            setShowBoardInput({
                isEdit: false,
                isShown: true,
            })

            return;
        }

        props.createBoard(newBoardName);
        setShowBoardInput({
            isEdit: false,
            isShown: false,
        })
    }

    const onDeleteBoardHandler = () => {
        if (!props.board) {
            return;
        }

        props.deleteBoard(props.board.boardID);
    }

    const onNewColumnCreateHandler = () => {
        props.columnCreate({
            ...newColumnCreate,
            order: (newColumnCreate.order - 2) >= 0 && props.board.columns.length > 0 ? (props.board.columns[newColumnCreate.order - 2].order + 1) : 1
        });
        setNewColumnCreate({
            boardID: props.board.boardID,
            columnID: 0,
            name: "",
            order: props.board.columns ? props.board.columns.length + 1 : 1,
        })
    }

    return (
        <>
            <h3>Your boards</h3>
            <select
                className="boards-select"
                name="boards"
                value={selectedBoardID}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => onSelectBoard(event)}
            >
                {
                    props.boardList ? props.boardList.map((board) => (
                        <option
                            key={`board-select-key-${board.boardID}`}
                            value={board.boardID}
                        >
                            {board.name}
                        </option>
                    )) : <></>
                }
            </select>

            <div>
                <h4>
                    Current board -
                    {
                        showBoardInput.isShown ?
                            <>
                                <input
                                    type="text"
                                    placeholder="New board name..."
                                    value={newBoardName}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNewBoardName(event.target.value)}
                                />
                                <button onClick={() => {
                                    setShowBoardInput({
                                        isEdit: false,
                                        isShown: false,
                                    });
                                    setNewBoardName("");
                                }}>Cancel</button>
                            </>
                            :
                            " " + props.board.name
                    }
                </h4>
                {
                    showBoardInput.isShown && showBoardInput.isEdit ?
                        <button onClick={onEditClickHandler}>Rename</button>
                        : showBoardInput.isShown && !showBoardInput.isEdit ?
                            <button onClick={onCreateClickHandler}>Create</button>
                            : !showBoardInput.isShown ?
                                <>
                                    <button onClick={onDeleteBoardHandler}>Delete</button>
                                    <button onClick={onEditClickHandler}>Rename</button>
                                    <button onClick={onCreateClickHandler}>Create</button>
                                </>
                                : <></>
                }
                <div>
                    <h4>Create column</h4>
                    <input
                        type="text"
                        placeholder="Column name..."
                        value={newColumnCreate.name}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNewColumnCreate(prev => ({
                            ...prev,
                            boardID: props.board.boardID,
                            name: event.target.value,
                        }))}
                    />
                    <input
                        type="number"
                        placeholder="Column order..."
                        min={1}
                        value={newColumnCreate.order}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNewColumnCreate(prev => ({
                            ...prev,
                            boardID: props.board.boardID,
                            order: parseInt(event.target.value),
                        }))}
                    />
                    <button onClick={onNewColumnCreateHandler}>Create</button>
                </div>
            </div>
        </>
    );
}