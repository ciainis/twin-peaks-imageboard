const spicedPg = require("spiced-pg");

const { dbUser, dbPass } = require("./secrets.json");
const db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/imageboard`);

module.exports.getImages = function() {
    return db.query("SELECT * FROM images ORDER BY id DESC");
};

module.exports.addImage = function(url, username, title, description) {
    return db.query(
        `INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [url, username, title, description]
    );
};

module.exports.getImage = function(imageid) {
    return db.query(
        `SELECT url, username, title, description
        FROM images
        WHERE id = $1`,
        [imageid]
    );
};

module.exports.getComments = function(imageid) {
    return db.query(
        `SELECT username, comment, created_at
        FROM comments
        WHERE image_id = $1`,
        [imageid]
    );
};

module.exports.addComment = function(username, comment, imageid) {
    return db.query(
        `INSERT INTO comments (username, comment, image_id)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [username, comment, imageid]
    );
};
