const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose')
const port = 5000;
const postRouter = require('./router/postRouter')
const dotenv = require('dotenv').config()

mongoose.connect(process.env.DATABASE_URL + process.env.DATABASE)
    .then(res => console.log("connection Succesfuly"))
    .catch(err => console.log("not Connected"))

app.use(cors());

app.use(express.json());

app.use(postRouter)
app.get("/app", (req, res) => {
    res.send('ok');
})
app.listen(port, () => {
    console.log("server is open at", port);
})