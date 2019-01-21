const spicedPg = require("spiced-pg");

const { dbUser, dbPass } = require("./secrets.json");
const db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/imageboard`);

module.exports.getImages = function() {
    return db.query("SELECT url, title FROM images");
};
