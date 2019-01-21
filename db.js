const spicedPg = require('spiced-pg')
const {dbUser, dbPass} = require('./secrets') 

db = spicedPg(`postgres://${dbUser}:${dbPass}@localhost:5432/imageboard`)

// GET IMAGES
module.exports.getImages = () => {
    return db.query(`
        SELECT * FROM images ORDER BY id DESC
    `)
}
