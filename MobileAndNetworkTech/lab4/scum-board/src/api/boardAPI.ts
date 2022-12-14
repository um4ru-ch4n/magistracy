import { axiosInstance } from "./api";
import { Board, BoardFull, Card } from "../domain/board";

export const BoardAPI = {
    updateCard: (card: Card) =>
        axiosInstance(true).post('board/column/card', card)
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
    getBoardList: () =>
        axiosInstance(true).get<{boards: Board[]}>('board')
            .then(res => {
                if (res.status !== 200) {
                    return {
                        error: res.statusText,
                        data: null,
                    }
                }

                return {
                    error: null,
                    data: res.data.boards
                }
            }),
    getBoard: (boardID: number) =>
        axiosInstance(true).get<{board: BoardFull}>(`board/${boardID}`)
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
}