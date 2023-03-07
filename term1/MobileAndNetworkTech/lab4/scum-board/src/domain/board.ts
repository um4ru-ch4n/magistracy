export type Board = {
    boardID: number;
    name: string;
}

export type Column = {
    columnID: number;
    boardID: number;
    name: string;
    order: number;
}

export type Card = {
    cardID: number;
    columnID: number;
    order: number;
    name: string;
    description: string;
}

export type ColumnFull = {
    columnID: number;
    boardID: number;
    name: string;
    order: number;
    cards: Card[];
}

export type BoardFull = {
    boardID: number;
    name: string;
    columns: ColumnFull[];
}