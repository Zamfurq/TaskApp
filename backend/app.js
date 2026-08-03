const express = require('express');

const app = express();
const PORT = 7000;
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { specs, swaggerUi } = require('./swagger');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
require('dotenv').config();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const db = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password, email]
 *             properties:
 *               username:
 *                 type: string
 *                 example: jdoe
 *               password:
 *                 type: string
 *                 format: password
 *                 example: hunter2
 *               email:
 *                 type: string
 *                 example: jdoe@example.com
 *     responses:
 *       200:
 *         description: User created, returns a JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: jdoe
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIs...
 *       500:
 *         description: Registration failed (hashing or database error)
 */
app.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const saltRound = 10;
    bcrypt.hash(password, saltRound, (err, hashedPassword) => {
        if (err) {
            res.status(500).send(`Couldn't hash password`)
        } else {
            db.query("INSERT INTO user (username, password, email) VALUES (? , ? , ?)", [username, hashedPassword, email], (err, result) => {
                if (err) {
                    res.status(500).send(`Couldn't hash password`)
                } else {
                    const token = jwt.sign({user: username}, process.env.JWT_SECRET_KEY, {expiresIn: '2h'});
                    res.send({username: username,token: token});
                }
            });
        }
    });
    
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in an existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: jdoe
 *               password:
 *                 type: string
 *                 format: password
 *                 example: hunter2
 *     responses:
 *       200:
 *         description: Login successful, returns a JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: jdoe
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIs...
 *       500:
 *         description: Username/password did not match
 */
app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    
    db.query("SELECT * FROM user WHERE username = ?", [username], (err, result) => {
        if (err) {
            res.status(500).send(err.message)
        } else if (result.length < 1) {
            res.status(500).send("Username/password did not match")
        } else {
            bcrypt.compare(password, result[0].password, (err, match) => {
                if (match) {
                    const token = jwt.sign({user: username}, process.env.JWT_SECRET_KEY, {expiresIn: '2h'});
                    res.send({username: username,token: token})
                }
                if(!match) {
                    res.status(500).send("Username/password did not match")
                }
            })
        }
    });
});

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send('Authorization header missing');
    }

  
    const token = authHeader.split(' ')[1];

    if (!token) {
    return res.status(401).send('Token missing');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(403).send('Invalid or expired token');
    }
}

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Retrieve the logged-in user's tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [In-progress, Pending, Completed]
 *         description: Filter tasks by status; omit to return all statuses
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   taskID:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: string
 *                   description:
 *                     type: string
 *                     example: string
 *                   status:
 *                     type: string
 *                     example: string
 *                   deadline:
 *                     type: string
 *                     format: date
 *                     example: 2026-08-01
 *       401:
 *         description: Authorization header/token missing
 *       403:
 *         description: Invalid or expired token
 *       404:
 *         description: User not found
 */
app.get('/tasks', authenticateJWT, async (req, res) => {
    const username = req.user.user;
    const status = req.query.status || null;
    db.query("SELECT * FROM user WHERE username = ?", [username], (err, result) => {
        if (err) return res.status(500).send(err.message);
        if (result.length < 1) return res.status(404).send("User not found");
        const userID = result[0].userID;
        db.query("SELECT * FROM task WHERE userID = ? " + (status === null ? '' : ' AND status = ?'), [userID, status], (err, result) => {
            if (err) return res.status(500).send(err.message);
            res.send(result)
        });
    });
    
    
});

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: description
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [In-progress, Pending, Completed]
 *       - in: query
 *         name: deadline
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner of the task
 *     responses:
 *       200:
 *         description: Task created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *       500:
 *         description: There is an error
 */
app.post('/tasks', authenticateJWT, async (req, res) => {
    const title = req.query.title;
    const description = req.query.description || null;
    const status = req.query.status;
    const deadline = req.query.deadline || null;
    const username = req.query.username;
    db.query("SELECT * FROM user WHERE username = ?", [username], (err, result) => {
        const userID = result[0].userID
        db.query("INSERT INTO task (title, description, status, deadline, userID) VALUES (? , ? , ?, ? , ?)", [title, description, status, deadline, userID], (err, result) => {
                if (err) {
                    res.status(500).send(`There is an error`)
                } else {
                    res.send({title: title,description: description});
                }
        });
    });

    
    
});

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unused by the handler; the task is looked up by the taskID query param instead
 *       - in: query
 *         name: taskID
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: description
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [In-progress, Pending, Completed]
 *       - in: query
 *         name: deadline
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: username
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *       500:
 *         description: There is an error
 */
app.put('/tasks/:id', authenticateJWT, async (req, res) => {
    const title = req.query.title;
    const description = req.query.description || null;
    const status = req.query.status;
    const deadline = req.query.deadline || null;
    const username = req.query.username;
    const taskID = req.query.taskID;

    db.query("UPDATE task SET title = ?, description = ?, status = ?, deadline = ? WHERE taskID = ?", [title, description, status, deadline, taskID], (err, result) => {
                    if (err) {
                        res.status(500).send(`There is an error`)
                    } else {
                        res.send({title: title,description: description});
                    }
            });
    
});

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unused by the handler; the task is looked up by the taskID query param instead
 *       - in: query
 *         name: taskID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deletion Completed
 *       500:
 *         description: There is an error
 */
app.delete('/tasks/:id', authenticateJWT, async (req, res) => {
    
    const taskID = req.query.taskID;

    db.query("DELETE FROM task WHERE taskID = ?", [taskID], (err, result) => {
                    if (err) {
                        res.status(500).send(`There is an error`)
                    } else {
                        res.send("Deletion Completed");
                    }
            });
    
});



app.listen(PORT, (e) => {
    if(!e)
        console.log("Running in port: " + PORT);
    else
        console.log("There is an error. ", e);
});

