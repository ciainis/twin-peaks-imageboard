const spicedPg = require('spiced-pg')
const {dbUser, dbPass} = require('./secrets') 

db = spicedPg(`postgres://${dbUser}:${dbPass}@localhost:5432/imageboard`)

// GET IMAGE
module.exports.getImage = (id) => {
    return db.query(`
        SELECT *
        FROM (
            SELECT *,
                LAG(id) OVER(ORDER BY created_at) as prev, 
                LEAD(id) OVER(ORDER BY created_at) as next  
            FROM images
            ) AS t
        WHERE id = $1`,
        [id]
    )
}

// GET IMAGES
module.exports.getImages = () => {
    return db.query(`
        SELECT *, 
        LAG(id) OVER(ORDER BY id) as prev, 
        LEAD(id) OVER(ORDER BY id) as next 
        FROM images
        ORDER BY id DESC
        LIMIT 9
    `)
}

// GET MORE IMAGES
module.exports.getMoreImages = (lastID) => {
    return db.query(`
        SELECT *,
        LAG(id) OVER(ORDER BY id) as prev, 
        LEAD(id) OVER(ORDER BY id) as next  
        FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 9`,
        [lastID]
    )
}

// IS LAST IMAGE
module.exports.isLastImage = () => {
    return db.query(`
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1
    `)
}

// ADD IMAGE
module.exports.addImage = (url, username, title, description) => {
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
module.exports.addComment = (username, comment, imageID) => {
    return db.query(`
        INSERT INTO comments (username, comment, image_id)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [username, comment, imageID]
    )
}