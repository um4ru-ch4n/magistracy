import React, { useEffect, useState } from "react";
import { BoardAPI } from "../../api/boardAPI";

import { BoardFull, Card, Board, ColumnFull, Column } from "../../domain/board";
import { BoardManagementPanel } from "./components/BoardManagementPanel";
import { BoardPageComponent } from "./components/BoardPageComponent";

const emptyBoard: BoardFull = {
    boardID: 0,
    name: "",
    columns: [],
}

export const BoardPage: React.FC = () => {
    const [boardList, setBoardList] = useState<Board[]>([]);
    const [board, setBoard] = useState<BoardFull>();

    useEffect(() => {
        BoardAPI.getBoardList()
            .then(res => {
                if (res.error) {
                    console.error(res.error);

                    return;
                }

                if (res.data) {
                    setBoardList(res.data);
                    if (res.data.length > 0) {
                        selectBoardHandler(res.data[0].boardID);
                    }
                }
            })
            .catch(err => {
                console.error(err);
            })
    }, [])

    const selectBoardHandler = (boardID: number) => {
        BoardAPI.getBoard(boardID)
            .then(res => {
                if (res.error) {
                    console.error(res.error);

                    return;
                }

                if (res.data) {
                    setBoard(res.data)
                }
            })
            .catch(err => {
                console.error(err);
            })
    }

    const updateCards = (cards: Card[], columnID: number) => {
        BoardAPI.updateCards(cards, columnID)
            .then(res => {
                if (res.error) {
                    console.error(res.error);

                    return;
                }

                if (res.data) {
                    setBoard(prev => ({
                        boardID: prev!.boardID,
                        name: prev!.name,
                        columns:
                            prev!.columns.map(column => {
                                if (column.columnID == columnID) {
                                    column.cards = res.data
                                    return column
                                }

                                return column
                            }),
                    }))
                }

            })
            .catch(err => {
                console.error(err);
            })
    }

    const onAddCardHandler = (cardName: string, columnID: number) => {
        let cards: Card[] = [];

        board!.columns.forEach(column => {
            if (column.columnID === columnID) {
                setBoard(prev => ({
                    boardID: prev!.boardID,
                    name: prev!.name,
                    columns: prev!.columns.map(column => {
                        if (column.columnID === columnID) {
                            cards = [
                                ...(column.cards ? column.cards : []),
                                {
                                    cardID: 0,
                                    columnID: columnID,
                                    description: "",
                                    name: cardName,
                                    order: column.cards ? column.cards.sort((a, b) => a.order > b.order ? 1 : 0)[column.cards.length - 1].order + 1 : 1
                                }
                            ]

                            return {
                                boardID: column.boardID,
                                columnID: column.columnID,
                                name: column.name,
                                cards: cards,
                                order: column.order,
                            };
                        }

                        return column;
                    })
                }))

                updateCards(cards, columnID);
            }
        })
    }

    const renameBoard = (newBoardName: string, boardID: number) => {
        BoardAPI.renameBoard(newBoardName, boardID)
            .then(res => {
                if (res.error) {
                    console.log(res.error);
                }

                BoardAPI.getBoardList()
                    .then(res => {
                        if (res.error) {
                            console.error(res.error);

                            return;
                        }

                        if (res.data) {
                            setBoardList(res.data);
                            selectBoardHandler(boardID);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    })
            })
            .catch(err => {
                console.log(err);
            })
    }

    const createBoard = (newBoardName: string) => {
        BoardAPI.createBoard(newBoardName)
            .then(res => {
                if (res.error) {
                    console.log(res.error);
                }

                if (res.data) {
                    const newBoardID = res.data;

                    BoardAPI.getBoardList()
                        .then(res => {
                            if (res.error) {
                                console.error(res.error);

                                return;
                            }

                            if (res.data) {
                                setBoardList(res.data);
                                selectBoardHandler(newBoardID);
                            }
                        })
                        .catch(err => {
                            console.error(err);
                        })
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    const deleteCard = (cardID: number, columnID: number) => {
        let newCards: Card[] = []

        board!.columns.forEach(column => {
            if (column.columnID === columnID) {
                const removeID = column.cards.findIndex(card => card.cardID === cardID);
                console.log(removeID)

                column.cards.splice(removeID, 1);

                newCards = column.cards;
            }
        })

        BoardAPI.updateCards(newCards, columnID)
            .then(res => {
                if (res.error) {
                    console.error(res.error);

                    return;
                }

                if (res.data) {
                    setBoard(prev => ({
                        boardID: prev!.boardID,
                        name: prev!.name,
                        columns:
                            prev!.columns.map(column => {
                                if (column.columnID == columnID) {
                                    column.cards = res.data
                                    return column
                                }

                                return column
                            }),
                    }))
                }

            })
            .catch(err => {
                console.error(err);
            })
    }

    const renameColumn = (newColumnName: string, columnID: number) => {
        const newColumns: ColumnFull[] = board!.columns.map(column => {
            if (column.columnID === columnID) {
                return {
                    boardID: column.boardID,
                    cards: column.cards,
                    columnID: columnID,
                    name: newColumnName,
                    order: column.order,
                };
            }

            return {
                boardID: column.boardID,
                cards: column.cards,
                columnID: column.columnID,
                name: column.name,
                order: column.order,
            };
        })

        BoardAPI.renameColumn(newColumnName, columnID)
            .then(res => {
                if (res.error) {
                    console.log(res.error);
                    return;
                }

                setBoard(prev => ({
                    boardID: prev!.boardID,
                    name: prev!.name,
                    columns: newColumns,
                }))
            })
            .catch(err => {
                console.log(err);
            })
    }

    const deleteColumn = (columnID: number) => {
        BoardAPI.deleteColumn(columnID)
            .then(res => {
                if (res.error) {
                    console.log(res.error);
                    return;
                }

                selectBoardHandler(board!.boardID);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const columnCreate = (column: Column) => {
        BoardAPI.createColumn(column)
            .then(res => {
                if (res.error) {
                    console.log(res.error)
                }

                selectBoardHandler(board!.boardID);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const deleteBoard = (boardID: number) => {
        BoardAPI.deleteBoard(boardID)
            .then(res => {
                if (res.error) {
                    console.log(res.error);
                    return;
                }

                BoardAPI.getBoardList()
                    .then(res => {
                        if (res.error) {
                            console.error(res.error);

                            return;
                        }

                        if (res.data) {
                            setBoardList(res.data);
                            selectBoardHandler(res.data[0].boardID);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    })
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <div className="wrapper">
            <div className="container">
                <BoardManagementPanel
                    boardList={boardList}
                    board={board || emptyBoard}
                    onSelectBoard={selectBoardHandler}
                    renameBoard={renameBoard}
                    createBoard={createBoard}
                    deleteBoard={deleteBoard}
                    columnCreate={columnCreate}
                />
                {
                    board ?
                        <BoardPageComponent
                            board={board}
                            updateCards={updateCards}
                            addCard={onAddCardHandler}
                            deleteCard={deleteCard}
                            renameColumn={renameColumn}
                            deleteColumn={deleteColumn}
                        />
                        : <></>
                }
            </div>
        </div>
    );
};