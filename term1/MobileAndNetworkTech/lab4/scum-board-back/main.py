from flask import Flask, request
import os
import psycopg2
from dotenv import load_dotenv
import hashlib
from flask_cors import CORS
import jwt

JWT_SECRET = "qakjfghlasejkrghkl;aerhjfgtklqerjhng"

load_dotenv()  # loads variables from .env file into environment

app = Flask(__name__)

cors = CORS(app, resources={r"/*": {"origins": "*"}})

url = os.environ.get("DATABASE_URL")  # gets variables from environment
connection = psycopg2.connect(
    "dbname='db_scum_board' user='postgres' host='172.19.0.2' password='postgres' port='5432'")


@app.post("/auth/register")
def register():
    data = request.get_json()

    if data["username"] == "" or data["password"] == "":
        return {"error": "username and password must not be empty"}, 400

    hash_object = hashlib.sha256(data["password"].encode('utf8'))
    hash = hash_object.hexdigest()

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO users (username, hash) VALUES (%s, %s);", (data["username"], hash))

    return {}, 201


@app.post("/auth/login")
def login():
    data = request.get_json()

    if data["username"] == "":
        return {}, 401

    hash_object = hashlib.sha256(data["password"].encode('utf8'))
    hash = hash_object.hexdigest()

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT user_id FROM users WHERE username = %s AND hash = %s;", (data["username"], hash))

            user_ids = cursor.fetchall()

            if len(user_ids) == 0:
                return {}, 401

            encoded_jwt = jwt.encode(
                {"userID": user_ids[0][0], "username": data["username"]}, JWT_SECRET, algorithm="HS256")

            return {"token": "Bearer " + encoded_jwt}, 200


@app.get("/auth/validate")
def validate():
    auth_header = request.headers.get('Authorization')

    _, status = checkAuth(auth_header)

    return {}, status


def checkAuth(auth_header):
    if not auth_header:
        return 0, 401

    splited_header = auth_header.split(" ")
    if len(splited_header) < 2:
        return 0, 401

    token = splited_header[1]

    try:
        encoded_jwt = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except:
        return 0, 401

    if len(encoded_jwt) == 0:
        return 0, 401

    if "userID" not in encoded_jwt:
        return 0, 401

    user_id = encoded_jwt["userID"]

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT EXISTS (SELECT 1 FROM users WHERE user_id = %s);", (user_id, ))

            if cursor.fetchone() is None:
                return 0, 401

    return user_id, 200

@app.post("/board")
def upsertBoard():
    auth_header = request.headers.get('Authorization')

    user_id, status = checkAuth(auth_header)
    if status != 200:
        return {}, 401

    data = request.get_json()

    if "boardName" not in data:
        return {"error": "boardName field is required"}, 400

    if len(data["boardName"]) < 3:
        return {"error": "boardName length must be at least 3 symbols"}, 400

    board_id = 0
    with connection:
        with connection.cursor() as cursor:
            if "boardID" not in data or data["boardID"] is None:
                cursor.execute(
                    "INSERT INTO boards (name) VALUES (%s) RETURNING board_id;", (data["boardName"], ))

                board_ids = cursor.fetchone()

                if board_ids is None:
                    return {"error", "couldn't get new board id"}, 500

                board_id = board_ids[0]

                cursor.execute(
                    "INSERT INTO users_boards (user_id, board_id) VALUES (%s, %s);", (user_id, board_id))

                return {"boardID": board_id}, 201

            cursor.execute(
                "UPDATE boards SET name = %s WHERE board_id = %s;", (data["boardName"], data["boardID"] ))

            return {}, 204


@app.get("/board")
def getBoardList():
    auth_header = request.headers.get('Authorization')

    user_id, status = checkAuth(auth_header)
    if status != 200:
        return {}, 401

    board_list = []
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                '''
                    SELECT b.board_id,
                           b.name
                    FROM users_boards AS ub
                    JOIN boards AS b
                        ON b.board_id = ub.board_id
                    WHERE ub.user_id = %s;
                ''', (user_id, ))

            boards = cursor.fetchall()

            for board in boards:
                board_list.append({
                    "boardID": board[0],
                    "name": board[1]
                })

    return {"boardList": board_list}, 200


def lst2pgarr(alist):
    return '{' + ','.join(alist) + '}'


@app.get("/board/<boardID>")
def getBoard(boardID):
    auth_header = request.headers.get('Authorization')

    _, status = checkAuth(auth_header)
    if status != 200:
        return {}, 401

    board = {}
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                '''
                    SELECT board_id,
                           name
                    FROM boards
                    WHERE board_id = %s;
                ''', (boardID, ))

            board = cursor.fetchone()

            if board is None:
                return {"error": "board with such id not found"}, 404

            resBoard = {
                "boardID": board[0],
                "name": board[1]
            }

            cursor.execute(
                '''
                    SELECT column_id,
                           column_order,
                           name
                    FROM columns
                    WHERE board_id = %s
                    ORDER BY column_order ASC;
                ''', (boardID, ))

            columns = cursor.fetchall()

            if len(columns) == 0:
                return {"board": resBoard}, 200

            columnIDs = []
            resColumns = []
            for column in columns:
                columnIDs.append(str(column[0]))

                resColumns.append({
                    "columnID": column[0],
                    "order": column[1],
                    "name": column[2],
                    "boardID": boardID
                })

            resBoard["columns"] = resColumns

            cursor.execute(
                '''
                    SELECT card_id,
                           column_id,
                           card_order,
                           name,
                           description
                    FROM cards
                    WHERE column_id = ANY(%s)
                    ORDER BY card_order ASC;
                ''', (lst2pgarr(columnIDs), ))

            cards = cursor.fetchall()

            if len(cards) == 0:
                return {"board": resBoard}, 200

            resCards = {}
            for card in cards:
                if card[1] not in resCards:
                    resCards[card[1]] = []

                resCards[card[1]].append({
                    "cardID": card[0],
                    "columnID": card[1],
                    "order": card[2],
                    "name": card[3],
                    "description": card[4]
                })

            for i in range(len(resBoard["columns"])):
                if resBoard["columns"][i]["columnID"] not in resCards:
                    continue

                resBoard["columns"][i]["cards"] = resCards[resBoard["columns"]
                                                           [i]["columnID"]]

    return {"board": resBoard}, 200


@app.post("/board/column/cards")
def upsertCards():
    auth_header = request.headers.get('Authorization')

    _, status = checkAuth(auth_header)
    if status != 200:
        return {}, 401

    data = request.get_json()

    if "cards" not in data or "columnID" not in data:
        return {"error": "some of required fields are omitted"}, 400

    resCards = []
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                '''
                    DELETE FROM cards
                    WHERE column_id = %s;
                ''', (data["columnID"], ))

            if len(data["cards"]) == 0:
                return {"cards": []}, 200

            d = multipleCardsInsert(data["cards"], data["columnID"])
            query = "INSERT INTO cards (column_id, card_order, name, description) VALUES " + d + ' RETURNING card_id, column_id, card_order, name, description;'

            cursor.execute(query, ())

            cards = cursor.fetchall()

            for card in cards:
                resCards.append({
                    "cardID": card[0],
                    "columnID": card[1],
                    "order": card[2],
                    "name": card[3],
                    "description": card[4]
                })
    
    return {"cards": resCards}


def multipleCardsInsert(cards, columnID):
    values = []

    for i in range(len(cards)):
        if i == len(cards) - 1:
            values.append("({}, {}, \'{}\', \'{}\')".format(columnID, cards[i]["order"], cards[i]["name"], cards[i]["description"]))
            continue

        values.append("({}, {}, \'{}\', \'{}\'), ".format(columnID, cards[i]["order"], cards[i]["name"], cards[i]["description"]))

    return "".join(values)


@app.post("/board/columns")
def upsertColumns():
    auth_header = request.headers.get('Authorization')

    _, status = checkAuth(auth_header)
    if status != 200:
        return {}, 401

    data = request.get_json()

    if "columns" not in data or "boardID" not in data:
        return {"error": "some of required fields are omitted"}, 400

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                '''
                    DELETE FROM columns
                    WHERE board_id = %s;
                ''', (data["boardID"], ))


            d = multipleColumnsInsert(data["columns"], data["boardID"])
            query = "INSERT INTO columns (board_id, name, column_order) VALUES " + d + ';'

            cursor.execute(query, ())
    
    return {}, 204

@app.patch("/board/column/name")
def renameColumn():
    auth_header = request.headers.get('Authorization')

    _, status = checkAuth(auth_header)
    if status != 200:
        return {}, 401

    data = request.get_json()

    if "name" not in data or "columnID" not in data:
        return {"error": "some of required fields are omitted"}, 400

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                '''
                    UPDATE columns
                    SET name = %s
                    WHERE column_id = %s;
                ''', (data["name"], data["columnID"], ))
    
    return {}, 204

def multipleColumnsInsert(columns, boardID):
    values = []

    for i in range(len(columns)):
        if i == len(columns) - 1:
            values.append("({}, \'{}\', {})".format(boardID, columns[i]["name"], columns[i]["order"]))
            continue

        values.append("({}, \'{}\', {}), ".format(boardID, columns[i]["name"], columns[i]["order"]))

    return "".join(values)

@app.delete("/board/column/<columnID>")
def deleteColumn(columnID):
    auth_header = request.headers.get('Authorization')

    _, status = checkAuth(auth_header)
    if status != 200:
        return {}, 401

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                '''
                    DELETE FROM cards
                    WHERE column_id = %s;
                ''', (columnID, ))
            
            cursor.execute(
                '''
                    DELETE FROM columns
                    WHERE column_id = %s;
                ''', (columnID, ))
    
    return {}, 204

@app.post("/board/column")
def createColumn():
    auth_header = request.headers.get('Authorization')

    _, status = checkAuth(auth_header)
    if status != 200:
        return {}, 401

    data = request.get_json()

    if "boardID" not in data or "name" not in data or "order" not in data:
        return {"error": "some of required fields are omitted"}, 400

    if len(data["name"]) < 1:
        return {"error": "column name length must be at least 1 symbol"}

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                '''
                    SELECT column_id, column_order
                    FROM columns
                    WHERE column_order >= %s;
                ''', (data["order"], ))

            for column in cursor.fetchall():
                cursor.execute(
                    '''
                        UPDATE columns
                        SET column_order = %s
                        WHERE column_id = %s;
                    ''', (column[1]+1, column[0], ))

            cursor.execute(
                '''
                    INSERT INTO columns (board_id, name, column_order)
                    VALUES (%s, %s, %s);
                ''', (data["boardID"], data["name"], data["order"] ))
    
    return {}, 204

@app.delete("/board/<boardID>")
def deleteBoard(boardID):
    auth_header = request.headers.get('Authorization')

    _, status = checkAuth(auth_header)
    if status != 200:
        return {}, 401

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                '''
                    DELETE FROM cards
                    WHERE column_id = ANY(
                        SELECT column_id
                        FROM columns
                        WHERE board_id = %s
                    );
                ''', (boardID, ))
            
            cursor.execute(
                '''
                    DELETE FROM columns
                    WHERE board_id = %s;
                ''', (boardID, ))
            
            cursor.execute(
                '''
                    DELETE FROM users_boards
                    WHERE board_id = %s;
                ''', (boardID, ))

            cursor.execute(
                '''
                    DELETE FROM boards
                    WHERE board_id = %s;
                ''', (boardID, ))
    
    return {}, 204