const express = require("express");
const app = express();

const db = require("./db.js");

app.use(express.static("./public"));

app.get("/imageboard", (req, res) => {
    db.getImages().then(response => {
        res.json(response.rows);
    });
});

app.listen(8080, () => console.log("listening!"));
