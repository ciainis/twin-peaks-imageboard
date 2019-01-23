const spicedPg = require('spiced-pg')
const {dbUser, dbPass} = require('./secrets') 

db = spicedPg(`postgres://${dbUser}:${dbPass}@localhost:5432/imageboard`)

// GET IMAGES
module.exports.getImages = () => {
    return db.query(`
        SELECT * FROM images ORDER BY id DESC
    `)
}

// ADD IMAGE
module.exports.addImage = function(url, username, title, description) {
    return db.query(`
        INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [url, username, title, description]
    )
}

// GET COMMENTS
module.exports.getComments = (id) => {
    return db.query(`
        SELECT * FROM comments 
        WHERE image_id = $1
        ORDER BY id DESC`,
        [id]
    )
}

// ADD COMMENT
module.exports.addComment = function(username, comment, imageID) {
    return db.query(`
        INSERT INTO comments (username, comment, image_id)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [username, comment, imageID]
    )
}