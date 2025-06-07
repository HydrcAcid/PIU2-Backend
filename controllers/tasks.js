import { database } from "../database.js";
import jwt from "jsonwebtoken";

export const addTask = (req, res) => {
    let token = req.cookies.access_token;
    if(!token) {
        return res.status(401).json("Not authenticated.");
    }
    jwt.verify(token, "jwtkey", (err, user) => {
        if(err) {
            return res.status(403).json("Token is not valid.");
        }

        database.query("INSERT INTO board.task(`title`, `listid`, `status`) VALUES (?, ?, ?);", [req.body.title, req.params.id, 0], (err, data) => {
                if(err) {
                    return res.send(err);
                }
        
            return res.status(200).json("List added.");
        });
    });
}

export const updateTask = (req, res) => {
    let token = req.cookies.access_token;
    if(!token) {
        return res.status(401).json("Not authenticated.");
    }
    jwt.verify(token, "jwtkey", (err, user) => {
        if(err) {
            return res.status(403).json("Token is not valid.");
        }
        console.log(req.body.title, req.body.status, req.params.id);
        database.query("UPDATE board.task SET title = ?, status = ? WHERE taskid = ?", [req.body.title, req.body.status, req.params.id], (err, data) => {
            console.log(err, data);
            if(err) {
                return res.send(err);
            }
        
            return res.status(200).json("Task updated.");
        });
    });
}

export const removeTask = (req, res) => {
    let token = req.cookies.access_token;
    if(!token) {
        return res.status(401).json("Not authenticated.");
    }

    const query = `SELECT * FROM board.task WHERE taskid = ${req.params.id}`;
        database.query(query, [], (err, data) => {
        if(err) {
            return res.status(500).json(err);
        }

        if(data.length) {
            database.query("DELETE FROM board.task WHERE taskid = ?", [req.params.id], (err, data) => {
            if(err) {
                return res.status(500).send(err);
            }
        
                return res.status(200).json("Taskremoved.");
            });
        } else {
            return res.status(404).json("Task not found.");
        }
    });
}