import { database } from "../database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export const register = (req, res) => {
    const query = "SELECT * FROM board.users WHERE email = ?";

    database.query(query, [req.body.email], (err, data) => {
        if(err) {
            return res.status(500).json(err);
        }

        if(data.length) {
            return res.status(409).json("E-mail already registered");
        }

        const salt = bcrypt.genSaltSync(10)
        const passhash = bcrypt.hashSync(req.body.password, salt);

        const query = "INSERT INTO board.users(`email`,`username`,`hash`) VALUES (?)";
        const values = [
            req.body.email,
            req.body.username,
            passhash
        ];

        database.query(query, [values], (err, data) => {
            if(err) {
                return res.json(err);
            }

            return res.status(200).json("User created.");
        });
    });
}

export const login = (req, res) => {
    const querry = "SELECT * FROM board.users WHERE email = ?";

    database.query(querry, [req.body.email], (err, data) => {
        if(err) {
            return res.json(err);
        }

        if(data.length === 0) {
            return res.status(401).json("Wrong email or password.");
        }

        const authSucces = bcrypt.compareSync(req.body.password, data[0].hash);

        if(!authSucces) {
            return res.status(401).josn("Wrong email or password.");
        }

        const token = jwt.sign({id: data[0].id}, "jwtkey");
        const {hash, ...other} = data[0];
        res.cookie("acces_token", token, {
            httpOnly: true    
        }).status(200).json(other);
    });
}

export const logout = (req, res) => {
    res.clearCookie("acces_token", {
        sameSite: "none",
        secure: true
    }).status(200).json("User logged out.");
}