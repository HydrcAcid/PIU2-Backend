import { database } from "../database.js";
import jwt from "jsonwebtoken";

function generateRandomString() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segmentLength = 4;

  function getRandomSegment() {
    let segment = '';
    for (let i = 0; i < segmentLength; i++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return segment;
  }

  return `${getRandomSegment()}-${getRandomSegment()}`;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const createBoard = (req, res) => {
    let token = req.cookies.access_token;
    if(!token) {
        return res.status(401).json("Not authenticated.");
    }
    jwt.verify(token, "jwtkey", (err, user) => {
        if(err) {
            return res.status(403).json("Token is not valid.");
        }

        const q1 = new Promise((resolve, reject) => {
            database.query("INSERT INTO board.boards(`name`, `inv_code`, `color`, `state`) VALUES (?, ?, ?, ?);", [req.body.name, generateRandomString(), getRandomColor(), 0], (err, data) => {
                if(err) {
                    reject(err);
                }
                
            });

            resolve();
        });

        const q2 = new Promise((resolve, reject) => {
            database.query("INSERT INTO board.permissions(`userid`, `boardid`, `perms`) VALUES (?, LAST_INSERT_ID(), ?);", [user.id, 0], (err, data) => {
                if(err) {
                    reject(err);
                }
            });

            resolve();
        });

        q1.then(() => {
            return q2;
        }).then(() => {
            return res.status(200).json("Board created");
        }).catch((err) => {
            return res.status(500).json(err);
        });
    });
}

export const removeBoard = (req, res) => {
    console.log(req.params.id);
    let token = req.cookies.access_token;
    if(!token) {
        return res.status(401).json("Not authenticated.");
    }

    const q1 = new Promise((resolve, reject) => {
        const query = `DELETE FROM board.permissions WHERE boardid = ${req.params.id}`;
        database.query(query, [], (err, data) => {
        if(err) {
            return reject(err);
        }
        resolve(data);
        });
    });

    const q2 = new Promise((resolve, reject) => {
        database.query("DELETE FROM board.boards WHERE id = ?", [req.params.id], (err, data) => {
            if(err) {
                reject(err);
            }
    
            resolve();
        });
    });

    q1.then(() => {
        return q2;
    }).then(() => {
        return res.status(200).json("Board removed");
    }).catch((err) => {
        console.log(err);
        return res.status(500).json(err);
    });
}

export const renameBoard = (req, res) => {
    let token = req.cookies.access_token;
    if(!token) {
        return res.status(401).json("Not authenticated.");
    }
    jwt.verify(token, "jwtkey", (err, user) => {
        if(err) {
            return res.status(403).json("Token is not valid.");
        }
        database.query("UPDATE board.boards SET name = ? WHERE id = ?", [req.body.name, req.params.id], (err, data) => {
            if(err) {
                return res.send(err);
            }
        
            return res.status(200).json("Board renamed.");
        });
    });
}

export const getContent = (req, res) => {
    let token = req.cookies.access_token;
    if(!token) {
        return res.status(401).json("Not authenticated.");
    }

    jwt.verify(token, "jwtkey", (err, user) => {
        if(err) {
            return res.status(403).json("Token is not valid.");
        }
        // Get lists
        
        let result = [];
        const q1 = new Promise((resolve, reject) => {
            const query = `SELECT * FROM board.list l WHERE l.boardid=${req.params.id} AND EXISTS (SELECT * FROM board.permissions p WHERE p.boardid=${req.params.id} AND p.userid=${user.id});`;
            database.query(query, [], (err, data) => {
                if(err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        const q2 = (taskid) => {
            return new Promise((resolve, reject) => {
                const query2 = `SELECT * FROM board.task t WHERE t.listid=${taskid};`;
                database.query(query2, [], (err, data) => {
                    if(err) {
                        return reject(err);
                    }
                    resolve(data);
                });
            });
        }

        const combine = (data) => {
            return new Promise((resolve, reject) => {
                if(data.length === 0) {
                    resolve();
                }
                data.forEach((list, idx) => {
                    q2(list.id).then((tasks) => {
                        list.tasks = tasks;
                        if(idx + 1 === data.length) {
                            resolve();
                        }
                    }).catch((err) => {
                        reject(err);
                    });
                });
            });
        }

        q1.then((data) => {
            result = data;
            return combine(result);
        }).then(() => {
            return res.status(200).json(result);
        }).catch((err) => {
            return res.status(500).json(err);
        });
    });
}

export const getBoardUsers = (req, res) => {
    let token = req.cookies.access_token;
        if(!token) {
            return res.status(401).json("Not authenticated.");
        }
    
        jwt.verify(token, "jwtkey", (err, user) => {
            if(err) {
                return res.status(403).json("Token is not valid.");
            }
            const query = `SELECT u.id, u.username, u.email, u.color, p.perms FROM board.users u JOIN board.permissions p ON u.id = p.userid WHERE p.boardid=${req.params.id};`;
    
            database.query(query, [], (err, data) => {
                if(err) {
                    return res.send(err);
                }
    
                return res.status(200).json(data);
            });
        });
}

export const getBoardInfo = (req, res) => {
     let token = req.cookies.access_token;
        if(!token) {
            return res.status(401).json("Not authenticated.");
        }
    
        jwt.verify(token, "jwtkey", (err, user) => {
            if(err) {
                return res.status(403).json("Token is not valid.");
            }
            const query = `SELECT * FROM board.boards WHERE id=${req.params.id};`;
    
            database.query(query, [], (err, data) => {
                if(err) {
                    return res.send(err);
                }
    
                return res.status(200).json(data);
            });
        });
}

export const updateCredentials = (req, res) => {
    let token = req.cookies.access_token;
    if(!token) {
        return res.status(401).json("Not authenticated.");
    }
    jwt.verify(token, "jwtkey", (err, user) => {
        if(err) {
            return res.status(403).json("Token is not valid.");
        }
        database.query(`SELECT b.id FROM board.boards b WHERE b.inv_code='${req.body.code}'`, (err, data) => {
            if(err) {
                return res.send(err);
            }

            if(data.length === 0) {
                return res.status(404).json("Wrong invite code.");
            }   

            database.query("INSERT INTO board.permissions(`userid`, `boardid`, `perms`) VALUES (?, ?, ?)", [user.id, data[0].id, 0], (err, data) => {
                if(err) {
                    return res.send(err);
                }
        
                return res.status(200).json("User added.");
            });
        });
    });
}