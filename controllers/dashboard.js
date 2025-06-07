import { database } from "../database.js";
import jwt from "jsonwebtoken";

export const getinfo = (req, res) => {
    let token = req.cookies.access_token;
    if(!token) {
        return res.status(401).json("Not authenticated.");
    }

    jwt.verify(token, "jwtkey", (err, user) => {
        if(err) {
            return res.status(403).json("Token is not valid.");
        }
        const query = `SELECT b.id, b.name, b.color, perm_counts.permission_count FROM board.boards b JOIN board.permissions p ON b.id = p.boardid JOIN (SELECT boardid, COUNT(*) AS permission_count FROM board.permissions GROUP BY boardid) AS perm_counts ON b.id = perm_counts.boardid WHERE p.userid=${user.id};`;
        database.query(query, [], (err, data) => {
            if(err) {
                return res.send(err);
            }

            return res.status(200).json(data);
        });
    });
}