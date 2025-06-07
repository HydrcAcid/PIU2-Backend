import { database } from "../database.js";
import jwt from "jsonwebtoken";

export const addList = (req, res) => {
    let token = req.cookies.access_token;
    if(!token) {
        return res.status(401).json("Not authenticated.");
    }
    jwt.verify(token, "jwtkey", (err, user) => {
        if(err) {
            return res.status(403).json("Token is not valid.");
        }

        database.query("INSERT INTO board.list(`title`, `boardid`) VALUES (?, ?);", [req.body.title, req.params.id], (err, data) => {
                if(err) {
                    return res.send(err);
                }
        
            return res.status(200).json("List added.");
        });
    });
}

export const removeList = (req, res) => {
    let token = req.cookies.access_token;
        if(!token) {
            return res.status(401).json("Not authenticated.");
        }

    const query = `SELECT * FROM board.list WHERE id = ${req.params.id}`;
        database.query(query, [], (err, data) => {
        if(err) {
            return res.status(500).json(err);
        }

        if(data.length) {
            database.query("DELETE FROM board.list WHERE id = ?", [req.params.id], (err, data) => {
                if(err) {
                    return res.send(err);
                }
        
                return res.status(200).json("List removed.");
            });
        } else {
            return res.status(404).json("List not found.");
        }
        });
}