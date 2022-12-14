from flask import Flask, request
import os
import psycopg2
from dotenv import load_dotenv
import hashlib
from flask_cors import CORS

load_dotenv()  # loads variables from .env file into environment

app = Flask(__name__)

cors = CORS(app, resources={r"/*": {"origins": "*"}})

url = os.environ.get("DATABASE_URL")  # gets variables from environment
connection = psycopg2.connect("dbname='db_scum_board' user='postgres' host='172.19.0.2' password='postgres' port='5432'")


@app.post("/auth/register")
def register():
    data = request.get_json()

    if data["username"] == "" or data["password"] == "":
        return {error: "username and password must not be empty"}, 400

    hash_object = hashlib.sha256(data["password"].encode('utf8'))
    hash = hash_object.hexdigest()

    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO users (username, hash) VALUES (%s, %s);", (data["username"], hash))
    
    return {}, 201