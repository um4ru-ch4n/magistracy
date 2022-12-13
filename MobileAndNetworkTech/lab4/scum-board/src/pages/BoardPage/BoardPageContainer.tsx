import React, { useState } from "react";
import { BoardFull, ColumnFull, Card, Board } from "../../domain/board";

import { BoardPageComponent } from "./components/BoardPageComponent";

const boards: Map<number, BoardFull> = new Map([
    [1, {
        boardID: 1,
        name: 'Board 1',
        columns: new Map([
            [1, {
                columnID: 1,
                boardID: 1,
                name: 'Column 1',
                cards: new Map([
                    [1, {
                        cardID: 1,
                        columnID: 1,
                        name: 'Card 1',
                        description: 'Card 1 description',
                    }],
                    [2, {
                        cardID: 2,
                        columnID: 1,
                        name: 'Card 2',
                        description: 'Card 2 description',
                    }],
                ])
            }],
            [2, {
                columnID: 2,
                boardID: 1,
                name: 'Column 2',
                cards: new Map([
                    [3, {
                        cardID: 3,
                        columnID: 2,
                        name: 'Card 3',
                        description: 'Card 3 description',
                    }],
                ])
            }],
            [3, {
                columnID: 3,
                boardID: 1,
                name: 'Column 3',
                cards: new Map(),
            }],
        ])
    }],
    [2, {
        boardID: 2,
        name: 'Board 2',
        columns: new Map([
            [4, {
                columnID: 4,
                boardID: 2,
                name: 'Column 4',
                cards: new Map(),
            }],
            [5, {
                columnID: 5,
                boardID: 2,
                name: 'Column 5',
                cards: new Map(),
            }],
        ]),
    }],
    [3, {
        boardID: 3,
        name: 'Board 3',
        columns: new Map([
            [6, {
                columnID: 6,
                boardID: 3,
                name: 'Column 6',
                cards: new Map(),
            }],
            [7, {
                columnID: 7,
                boardID: 3,
                name: 'Column 7',
                cards: new Map(),
            }],
        ]),
    }],
]);

const boardList: Array<Board> = [
    {
        boardID: 1,
        name: 'Board 1',
    },
    {
        boardID: 2,
        name: 'Board 2',
    },
    {
        boardID: 3,
        name: 'Board 3',
    },
]

export const BoardPage: React.FC = () => {
    const [selectedBoardID, setSelectedBoardID] = useState<number>(boardList[0].boardID);

    return (
        <BoardPageComponent
            boardList={boardList}
            board={boards.get(selectedBoardID)!}
            onSelectBoard={(boardID: number) => { setSelectedBoardID(boardID); }}
        />
    );
};