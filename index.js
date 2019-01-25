const express = require("express");
const app = express();

const s3 = require("./s3");
const config = require("./config");

const bodyParser = require("body-parser");

var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

const db = require("./db.js");

app.use(bodyParser.json());

app.use(express.static("./public"));

app.get("/images", (req, res) => {
    db.getImages().then(response => {
        res.json(response.rows);
    });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    //uploader.single("file") puts the file into the uploads folder and changes the name of file to be some unique 24 character string
    console.log("POST upload!");
    // console.log(req.body); //file is not here
    // console.log(req.file); //file is here. it only happens with files; filename is the unique name.
    //save all the stuff in the database
    db.addImage(
        config.s3Url + req.file.filename,
        req.body.username,
        req.body.title,
        req.body.description
    )
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ error: "Something failed!" });
        });
});

app.get("/get-images/:imageid", (req, res) => {
    db.getImage(req.params.imageid)
        .then(response => {
            response.rows[0].created_at = new Date(
                response.rows[0].created_at
            ).toLocaleString();
            res.json(response.rows);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
});

app.get("/images/more/:imageid", (req, res) => {
    db.getMoreImages(req.params.imageid)
        .then(response => {
            res.json(response.rows);
        })
        .catch(err => {
            console.log("error: ", err);
            res.status(500).send(err);
        });
});

app.get("/get-comments/:imageid", (req, res) => {
    db.getComments(req.params.imageid)
        .then(response => {
            for (var i = 0; i < response.rows.length; i++) {
                response.rows[i].created_at = new Date(
                    response.rows[i].created_at
                ).toLocaleString();
            }
            res.json(response.rows);
        })
        .catch(err => console.log(err));
});

app.post("/comment/add", (req, res) => {
    db.addComment(req.body.username, req.body.comment, req.body.imageid)
        .then(response => {
            response.rows[0].created_at = new Date(
                response.rows[0].created_at
            ).toLocaleString();
            res.json(response.rows);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ error: "Something failed!" });
        });
});

app.get("/images/prev/:imageid", (req, res) => {
    Promise.all([
        db.getImage(req.params.imageid),
        db.getComments(req.params.imageid)
    ])
        .then(response => {
            res.json({
                image: response[0].rows,
                comments: response[1].rows
            });
        })
        .catch(err => console.log(err));
});

app.get("/images/next/:imageid", (req, res) => {
    Promise.all([
        db.getImage(req.params.imageid),
        db.getComments(req.params.imageid)
    ])
        .then(response => {
            res.json({
                image: response[0].rows,
                comments: response[1].rows
            });
        })
        .catch(err => console.log(err));
});

app.listen(8080, () => console.log("listening!"));
