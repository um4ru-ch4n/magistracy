import { axiosInstance } from "./api";
import { Board, BoardFull, Card, Column, ColumnFull } from "../domain/board";

export const BoardAPI = {
    updateCards: (cards: Card[], columnID: number) =>
        axiosInstance(true).post<{ "cards": Card[] }>('board/column/cards', { "cards": cards, "columnID": columnID })
            .then(res => {
                if (res.status !== 200) {
                    return {
                        error: res.statusText,
                        data: null,
                    }
                }

                return {
                    error: null,
                    data: res.data.cards,
                }
            }),
    getBoardList: () =>
        axiosInstance(true).get<{ boardList: Board[] }>('board')
            .then(res => {
                if (res.status !== 200) {
                    return {
                        error: res.statusText,
                        data: null,
                    }
                }

                return {
                    error: null,
                    data: res.data.boardList
                }
            }),
    getBoard: (boardID: number) =>
        axiosInstance(true).get<{ board: BoardFull }>(`board/${boardID}`)
            .then(res => {
                if (res.status !== 200) {
                    return {
                        error: res.statusText,
                        data: null,
                    }
                }

                return {
                    error: null,
                    data: res.data.board
                }
            }),
    renameBoard: (newBoardName: string, boardID: number) =>
        axiosInstance(true).post(`board`, { "boardName": newBoardName, "boardID": boardID })
            .then(res => {
                if (res.status !== 204) {
                    return {
                        error: res.statusText,
                    }
                }

                return {
                    error: null,
                }
            }),
    createBoard: (newBoardName: string) =>
        axiosInstance(true).post<{ "boardID": number }>(`board`, { "boardName": newBoardName })
            .then(res => {
                if (res.status !== 201) {
                    return {
                        error: res.statusText,
                        data: null,
                    }
                }

                return {
                    error: null,
                    data: res.data.boardID,
                }
            }),
    updateColumns: (columns: ColumnFull[], boardID: number) =>
        axiosInstance(true).post(`board/columns`, { "columns": columns, "boardID": boardID })
            .then(res => {
                if (res.status !== 204) {
                    return {
                        error: res.statusText,
                    }
                }

                return {
                    error: null,
                }
            }),
    renameColumn: (newColumnName: string, columnID: number) =>
        axiosInstance(true).patch(`board/column/name`, { "name": newColumnName, "columnID": columnID })
            .then(res => {
                if (res.status !== 204) {
                    return {
                        error: res.statusText,
                    }
                }

                return {
                    error: null,
                }
            }),
    deleteColumn: (columnID: number) =>
        axiosInstance(true).delete(`board/column/` + columnID)
            .then(res => {
                if (res.status !== 204) {
                    return {
                        error: res.statusText,
                    }
                }

                return {
                    error: null,
                }
            }),
    createColumn: (column: Column) =>
        axiosInstance(true).post(`board/column`, column)
            .then(res => {
                if (res.status !== 201) {
                    return {
                        error: res.statusText,
                    }
                }

                return {
                    error: null,
                }
            }),
    deleteBoard: (boardID: number) =>
        axiosInstance(true).delete(`board/` + boardID)
            .then(res => {
                if (res.status !== 204) {
                    return {
                        error: res.statusText,
                    }
                }

                return {
                    error: null,
                }
            }),
}