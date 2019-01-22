const spicedPg = require("spiced-pg");

const { dbUser, dbPass } = require("./secrets.json");
const db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/imageboard`);

module.exports.getImages = function() {
    return db.query(
        "SELECT url, title, description FROM images ORDER BY id DESC"
    );
};

module.exports.addImage = function(url, username, title, description) {
    return db.query(
        `INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [url, username, title, description]
    );
};
