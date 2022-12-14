import React, { useEffect, useState } from "react";
import { BoardAPI } from "../../api/boardAPI";

import { BoardFull, Card, Board } from "../../domain/board";
import { BoardPageComponent } from "./components/BoardPageComponent";

// const boards: BoardFull[] = [
//     {
//         boardID: 1,
//         name: 'Board 1',
//         columns: [
//             {
//                 columnID: 1,
//                 boardID: 1,
//                 name: 'Column 1',
//                 cards: [
//                     {
//                         cardID: 1,
//                         columnID: 1,
//                         name: 'Card 1',
//                         description: 'Card 1 description',
//                     },
//                     {
//                         cardID: 2,
//                         columnID: 1,
//                         name: 'Card 2',
//                         description: 'Card 2 description',
//                     },
//                 ]
//             },
//             {
//                 columnID: 2,
//                 boardID: 1,
//                 name: 'Column 2',
//                 cards: [
//                     {
//                         cardID: 3,
//                         columnID: 2,
//                         name: 'Card 3',
//                         description: 'Card 3 description',
//                     },
//                 ]
//             },
//             {
//                 columnID: 3,
//                 boardID: 1,
//                 name: 'Column 3',
//                 cards: [],
//             },
//         ]
//     },
//     {
//         boardID: 2,
//         name: 'Board 2',
//         columns: [
//             {
//                 columnID: 4,
//                 boardID: 2,
//                 name: 'Column 4',
//                 cards: [],
//             },
//             {
//                 columnID: 5,
//                 boardID: 2,
//                 name: 'Column 5',
//                 cards: [],
//             },
//         ],
//     },
//     {
//         boardID: 3,
//         name: 'Board 3',
//         columns: [
//             {
//                 columnID: 6,
//                 boardID: 3,
//                 name: 'Column 6',
//                 cards: [],
//             },
//             {
//                 columnID: 7,
//                 boardID: 3,
//                 name: 'Column 7',
//                 cards: [],
//             },
//         ],
//     },
// ];

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
                    selectBoardHandler(res.data[0].boardID);
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

    const updateCard = (card: Card) => {
        BoardAPI.updateCard(card)
            .then(res => {
                if (res.error) {
                    console.error(res.error);

                    return;
                }

                if (board) {
                    selectBoardHandler(board.boardID)
                }

            })
            .catch(err => {
                console.error(err);
            })
    }

    return (
        board ?
            <BoardPageComponent
                boardList={boardList}
                board={board}
                onSelectBoard={selectBoardHandler}
                updateCard={updateCard}
            />
            :
            <p>Board wasn't loaded</p>

    );
};