import { DoesTokenExists } from "./auth";

let boards = [
    {
        boardID: 1,
        name: 'Board 1',
        columns: [
            {
                columnID: 1,
                boardID: 1,
                name: 'Column 1',
                cards: [
                    {
                        cardID: 1,
                        columnID: 1,
                        order: 1,
                        name: 'Card 1',
                        description: 'Card 1 description',
                    },
                    {
                        cardID: 2,
                        columnID: 1,
                        order: 2,
                        name: 'Card 2',
                        description: 'Card 2 description',
                    },
                ]
            },
            {
                columnID: 2,
                boardID: 1,
                name: 'Column 2',
                cards: [
                    {
                        cardID: 3,
                        columnID: 2,
                        order: 1,
                        name: 'Card 3',
                        description: 'Card 3 description',
                    },
                ]
            },
            {
                columnID: 3,
                boardID: 1,
                name: 'Column 3',
                cards: [],
            },
        ]
    },
    {
        boardID: 2,
        name: 'Board 2',
        columns: [
            {
                columnID: 4,
                boardID: 2,
                name: 'Column 4',
                cards: [],
            },
            {
                columnID: 5,
                boardID: 2,
                name: 'Column 5',
                cards: [],
            },
        ],
    },
    {
        boardID: 3,
        name: 'Board 3',
        columns: [
            {
                columnID: 6,
                boardID: 3,
                name: 'Column 6',
                cards: [],
            },
            {
                columnID: 7,
                boardID: 3,
                name: 'Column 7',
                cards: [],
            },
        ],
    },
];

const boardList = [
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

export const getBoardList = (req, res, ctx) => {
    const headers = req.headers;
    const token = headers.get('Authorization');

    if (DoesTokenExists(token).username === undefined) {
        return res(
            ctx.status(401),
        )
    }

    return res(
        ctx.status(200),
        ctx.set('Content-Type', 'application/json'),
            ctx.json({
                boards: boardList,
            })
    );
};

export const getBoard = (req, res, ctx) => {
    const headers = req.headers;
    const token = headers.get('Authorization');

    if (DoesTokenExists(token).username === undefined) {
        return res(
            ctx.status(401),
        )
    }

    const boardID = parseInt(req.params.boardID);

    return res(
        ctx.status(200),
        ctx.set('Content-Type', 'application/json'),
            ctx.json({
                board: boards.find((board) => board.boardID === boardID),
            })
    );
};

export const updateCard = (req, res, ctx) => {
    const headers = req.headers;
    const token = headers.get('Authorization');

    if (DoesTokenExists(token).username === undefined) {
        return res(
            ctx.status(401),
        )
    }

    const card = req.body;

    let err = updateBoardCard(card);
    if (err !== '') {
        return res(
            ctx.status(400),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({
                error: err,
            })
        )
    }

    return res(
        ctx.status(204),
    );
};

// hard logic with orders) must be fixed later. when I drag some card, others orders must be recalculated...
const updateBoardCard = (card) => {
    for (let i = 0; i < boards.length; i++) {
        for (let j = 0; j < boards[i].columns.length; j++) {
            for (let k = 0; k < boards[i].columns[j].cards.length; k++) {
                if (card.cardID === boards[i].columns[j].cards[k].cardID) {
                    boards[i].columns[j].cards.splice(k, 1);

                    const idx = boards[i].columns.findIndex((column) => column.columnID === card.columnID);

                    boards[i].columns[idx].cards.splice(card.order, 0, card);

                    return "";
                }
            }
        }
    }

    return "card with such id wasn't found";
}