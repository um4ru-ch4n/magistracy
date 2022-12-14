CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username TEXT UNIQUE NOT NULL,
    hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS boards (
    board_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS users_boards (
    user_id INT NOT NULL,
    board_id INT NOT NULL,
    CONSTRAINT users_boards_user_id_fk FOREIGN KEY(user_id) REFERENCES users(user_id),
    CONSTRAINT users_boards_board_id_fk FOREIGN KEY(board_id) REFERENCES boards(board_id),
    PRIMARY KEY (user_id, board_id)
);

CREATE TABLE IF NOT EXISTS columns (
    column_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    board_id INT NOT NULL,
    name TEXT NOT NULL DEFAULT '',
    column_order INT NOT NULL,
    CONSTRAINT columns_board_id_fk FOREIGN KEY(board_id) REFERENCES boards(board_id)
);

CREATE TABLE IF NOT EXISTS cards (
    card_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    column_id INT NOT NULL,
    name TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    cards_order INT NOT NULL,
    CONSTRAINT cards_column_id_fk FOREIGN KEY(column_id) REFERENCES columns(column_id)
);
