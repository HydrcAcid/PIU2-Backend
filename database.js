import mysql from "mysql2"

export const database = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"9786",
    database:"board"
});