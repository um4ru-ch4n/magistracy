import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { BoardFull, Board, ColumnFull, Card } from "../../../domain/board";

type BoardPageComponentPropsType = {
    boardList: Array<Board>;
    board: BoardFull;
    onSelectBoard: (boardID: number) => void;
    updateCard: (card: Card) => void;
}

export const BoardPageComponent: React.FC<BoardPageComponentPropsType> = (props) => {
    const [columns, setColumns] = useState<ColumnFull[]>(props.board.columns);
    const [selectedBoardID, setSelectedBoardID] = useState<number>(props.board.boardID);

    useEffect(() => {
        setColumns(props.board.columns);
    }, [props.board.columns]);

    const onSelectBoard = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const boardID = parseInt(event.target.value);
        setSelectedBoardID(boardID);

        props.onSelectBoard(boardID);
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[parseInt(source.droppableId)];
            const destColumn = columns[parseInt(destination.droppableId)];
            const sourceItems = [...sourceColumn.cards];
            const destItems = [...destColumn.cards];
            const [removed] = sourceItems.splice(source.index, 1);

            removed.columnID = destColumn.columnID;
            removed.order = destination.index+1;

            props.updateCard(removed);

            destItems.splice(destination.index, 0, removed);

            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    cards: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    cards: destItems
                }
            });
        } else {
            const column = columns[parseInt(source.droppableId)];
            const copiedItems = [...column.cards];
            const [removed] = copiedItems.splice(source.index, 1);

            removed.columnID = columns[parseInt(source.droppableId)].columnID;
            removed.order = destination.index+1;
            console.log(removed)
            props.updateCard(removed);

            copiedItems.splice(destination.index, 0, removed);

            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    cards: copiedItems
                }
            });
        }
    }

    return (
        <div className="wrapper">
            <div className="container">
                <h3>Your boards</h3>
                <select
                    className="boards-select"
                    name="boards"
                    value={selectedBoardID}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => onSelectBoard(event)}
                >
                    {
                        props.boardList.map((board) => (
                            <option
                                key={`board-select-key-${board.boardID}`}
                                value={board.boardID}
                            >
                                {board.name}
                            </option>
                        ))
                    }
                </select>

                <div
                    className="current-board"
                >
                    <DragDropContext
                        onDragEnd={result => onDragEnd(result)}
                    >
                        {
                            Object.entries(columns).map(([columnID, column]) => {
                                return (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center"
                                        }}
                                        key={`column-key-${columnID}`}
                                    >
                                        <h2>{column.name}</h2>
                                        <div style={{ margin: 8 }}>
                                            <Droppable droppableId={columnID.toString()} key={`droppable-column-key-${columnID}`}>
                                                {(provided, snapshot) => {
                                                    return (
                                                        <div
                                                            {...provided.droppableProps}
                                                            ref={provided.innerRef}
                                                            style={{
                                                                background: snapshot.isDraggingOver
                                                                    ? "lightblue"
                                                                    : "lightgrey",
                                                                padding: 4,
                                                                width: 250,
                                                                minHeight: 500
                                                            }}
                                                        >
                                                            {column.cards.sort((a, b) => a.order > b.order ? 1 : -1).map((card, index) => {
                                                                return (
                                                                    <Draggable
                                                                        key={`card-key-${card.cardID}`}
                                                                        draggableId={card.cardID.toString()}
                                                                        index={index}
                                                                    >
                                                                        {(provided, snapshot) => {
                                                                            return (
                                                                                <div
                                                                                    ref={provided.innerRef}
                                                                                    {...provided.draggableProps}
                                                                                    {...provided.dragHandleProps}
                                                                                    style={{
                                                                                        userSelect: "none",
                                                                                        padding: 16,
                                                                                        margin: "0 0 8px 0",
                                                                                        minHeight: "50px",
                                                                                        backgroundColor: snapshot.isDragging
                                                                                            ? "#263B4A"
                                                                                            : "#456C86",
                                                                                        color: "white",
                                                                                        ...provided.draggableProps.style
                                                                                    }}
                                                                                >
                                                                                    {card.name}
                                                                                </div>
                                                                            );
                                                                        }}
                                                                    </Draggable>
                                                                );
                                                            })}
                                                            {provided.placeholder}
                                                        </div>
                                                    );
                                                }}
                                            </Droppable>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </DragDropContext>
                </div>
            </div>
        </div>
    );
};