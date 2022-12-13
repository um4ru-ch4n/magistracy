export type Board = {
    boardID: number;
    name: string;
}

export type Column = {
    columnID: number;
    boardID: number;
    name: string;
}

export type Card = {
    cardID: number;
    columnID: number;
    name: string;
    description: string;
}

export type ColumnFull = {
    columnID: number;
    boardID: number;
    name: string;
    cards: Map<number, Card>;
}

export type BoardFull = {
    boardID: number;
    name: string;
    columns: Map<number, ColumnFull>;
}