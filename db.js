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

// ADD LIKE 
module.exports.addLike = (id, count) => {
    return db.query(`
        UPDATE images 
        SET like_button = $2
        WHERE id = $1
        RETURNING *`,
        [id, count]
    )
}

// GET IMAGE WITH COMMENT COUNT
module.exports.getImageWithCommentCount = (id) => {
    return db.query(`
        SELECT * 
        FROM (
            SELECT images.*,
                COUNT(comments.image_id) AS comments_count,
                LAG(images.id) OVER(ORDER BY images.created_at) as prev, 
                LEAD(images.id) OVER(ORDER BY images.created_at) as next  
            FROM images
            LEFT JOIN comments
            ON images.id = comments.image_id
            GROUP BY images.id
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

// GET IMAGES AND COMMENTS COUNT
module.exports.getImagesWithcommentCount = () => {
    return db.query(`
        SELECT images.* ,
        COUNT(comments.image_id) AS comments_count, 
        LAG(images.id) OVER(ORDER BY images.id) as prev, 
        LEAD(images.id) OVER(ORDER BY images.id) as next 
        FROM images
        LEFT JOIN comments
        ON images.id = comments.image_id
        GROUP BY images.id
        ORDER BY images.id DESC
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

// GET MORE IMAGES
module.exports.getMoreImagesWithCommentCount = (lastID) => {
    return db.query(`
        SELECT images.*,
        LAG(id) OVER(ORDER BY id) as prev, 
        LEAD(id) OVER(ORDER BY id) as next  
        FROM images
        WHERE id < $1
        LEFT JOIN comments
        ON images.id = comments.image_id
        GROUP BY images.id
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