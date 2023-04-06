const express = require('express');
const router = new express.Router();
const postModel = require('../model/postModel');
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
require("dotenv").config();
const { GridFSBucket, MongoClient } = require("mongodb");
const client = new MongoClient(process.env.DATABASE_URL);


const Storage = new GridFsStorage({
    url: process.env.DATABASE_URL + process.env.DATABASE,
    file: (req, file) => {
        return {
            bucketName: process.env.COLLECTION,
            fileName: `${Date.now()}_${file.originalname}`
        }
    }
});


const upload = multer({ storage: Storage });


router.get("/posts/:file", async (req, res) => {
    try {
        await client.connect();
        const DB = client.db(process.env.DATABASE);
        const bucket = new GridFSBucket(DB, { bucketName: process.env.COLLECTION });

        const event = bucket.openDownloadStreamByName(req.params.file);
        event.on("data", (data) => { return res.write(data) });
        event.on("error", (error) => { return res.write(error) });
        event.on("end", () => { return res.end() });
    }
    catch (e) { res.status(400).send(e.message) }
})


router.get("/posts", async (req, res) => {
    try {
        const dbdata = await postModel.find().sort({ _id: -1 });
        res.status(200).json(dbdata);
    }
    catch (e) { console.log(e.message); }
})


router.post("/posts", upload.single("PostImage"), async (req, res) => {
    try {
        const data = new postModel({ PostImage: req.file.filename, ...req.body });
        const createData = data.save();
        res.send(createData);
    }
    catch (e) { res.status(400).send(e.message); }
})

module.exports = router;