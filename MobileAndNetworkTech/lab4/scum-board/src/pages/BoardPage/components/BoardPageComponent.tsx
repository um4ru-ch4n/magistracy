import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { BoardFull, Board, ColumnFull, Card, Column } from "../../../domain/board";

type BoardPageComponentPropsType = {
    board: BoardFull;
    updateCards: (cards: Card[], columnID: number) => void;
    addCard: (cardName: string, columnID: number) => void;
    deleteCard: (cardID: number, columnID: number) => void;
    renameColumn: (newColumnName: string, columnID: number) => void;
    deleteColumn: (columnID: number) => void;
}

export const BoardPageComponent: React.FC<BoardPageComponentPropsType> = (props) => {
    const [columns, setColumns] = useState<ColumnFull[]>(props.board.columns);
    const [isAdd, setIsAdd] = useState<{ "isAdd": boolean, "columnID": number }>({ "isAdd": false, "columnID": 0 });
    const [newCardName, setNewCardName] = useState<string>("");

    const [newColumnName, setNewColumnName] = useState<string>("");
    const [showNewColumnNameInput, setShowNewColumnNameInput] = useState<{ "isShown": boolean, "columnID": number }>({ isShown: false, columnID: 0 });

    useEffect(() => {
        setColumns(props.board.columns);
    }, [props.board.columns]);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[parseInt(source.droppableId)];
            const destColumn = columns[parseInt(destination.droppableId)];
            const sourceItems = [...(sourceColumn.cards || [])];
            const destItems = [...(destColumn.cards || [])];
            const [removed] = sourceItems.splice(source.index, 1);

            removed.columnID = destColumn.columnID;

            destItems.splice(destination.index, 0, removed);

            for (let i = 0; i < destItems.length; i++) {
                destItems[i].order = i + 1;
            }

            props.updateCards(destItems, destColumn.columnID);
            props.updateCards(sourceItems, sourceColumn.columnID);

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

            copiedItems.splice(destination.index, 0, removed);

            for (let i = 0; i < copiedItems.length; i++) {
                copiedItems[i].order = i + 1;
            }

            props.updateCards(copiedItems, column.columnID);

            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    cards: copiedItems
                }
            });
        }
    }

    const onDeleteCardHandler = (cardID: number, columnID: number) => {
        props.deleteCard(cardID, columnID);
    }

    const onColumnNameChangeHandler = (column: ColumnFull) => {
        if (!showNewColumnNameInput.isShown || (showNewColumnNameInput.isShown && showNewColumnNameInput.columnID !== column.columnID)) {
            setNewColumnName(column.name);
            setShowNewColumnNameInput({
                isShown: true,
                columnID: column.columnID,
            })

            return;
        }

        props.renameColumn(newColumnName, column.columnID);
        setNewColumnName("");
        setShowNewColumnNameInput({
            isShown: false,
            columnID: 0,
        })
    }

    const onDeleteColumnHandler = (columnID: number) => {
        props.deleteColumn(columnID);
    }

    return (

        <div
            className="current-board"
        >
            <DragDropContext
                onDragEnd={result => onDragEnd(result)}
            >
                {
                    columns ?
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
                                    <h2>
                                        {
                                            showNewColumnNameInput.isShown && showNewColumnNameInput.columnID === column.columnID ?
                                                <input
                                                    type="text"
                                                    value={newColumnName}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNewColumnName(event.target.value)}
                                                />
                                                :
                                                column.name
                                        }
                                        <span className="column-name-edit-button" onClick={() => onColumnNameChangeHandler(column)}>&#9998;</span>
                                        <span className="column-delete-button" onClick={() => onDeleteColumnHandler(column.columnID)}>&#x2715;</span>
                                    </h2>
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
                                                        {column.cards ? column.cards.sort((a, b) => a.order > b.order ? 1 : -1).map((card, index) => {
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
                                                                                    display: "flex",
                                                                                    justifyContent: "space-between",
                                                                                    alignItems: "center",
                                                                                    ...provided.draggableProps.style
                                                                                }}
                                                                            >
                                                                                {card.name}
                                                                                <span className="column-delete-button" onClick={() => onDeleteCardHandler(card.cardID, column.columnID)}>&#x2715;</span>
                                                                            </div>
                                                                        );
                                                                    }}
                                                                </Draggable>
                                                            );
                                                        }) : <></>}
                                                        {provided.placeholder}
                                                        <div className="add-card">
                                                            {
                                                                isAdd.isAdd && isAdd.columnID === column.columnID ?
                                                                    <input
                                                                        className="add-card__input"
                                                                        type="text"
                                                                        placeholder="Card name..."
                                                                        value={newCardName}
                                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNewCardName(event.target.value)}
                                                                    />
                                                                    :
                                                                    <></>
                                                            }
                                                            <span
                                                                className="add-card__button"
                                                                onClick={() => {
                                                                    if (!isAdd.isAdd) {
                                                                        setIsAdd({
                                                                            columnID: column.columnID,
                                                                            isAdd: true,
                                                                        });

                                                                        return;
                                                                    }

                                                                    if (isAdd.isAdd && isAdd.columnID !== column.columnID) {
                                                                        setNewCardName("");
                                                                        setIsAdd({
                                                                            columnID: column.columnID,
                                                                            isAdd: true,
                                                                        });

                                                                        return;
                                                                    }

                                                                    props.addCard(newCardName, column.columnID)
                                                                    setNewCardName("");
                                                                    setIsAdd({
                                                                        columnID: 0,
                                                                        isAdd: false,
                                                                    });
                                                                }}
                                                            >+</span>
                                                        </div>
                                                    </div>
                                                );
                                            }}
                                        </Droppable>
                                    </div>
                                </div>
                            );
                        })
                        : <></>
                }
            </DragDropContext>
        </div>
    );
};