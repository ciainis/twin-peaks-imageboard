const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const uidSafe = require('uid-safe')
const path = require('path')

const {s3Url} = require('./config') 
const {getImages, addImage, getComments, addComment} = require('./db')
const {upload} = require('./s3')

const app = express()

app.use(bodyParser.json())
app.use('/', express.static('./public'))
app.use('/', express.static('./uploads'))


const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads')
    },
    filename: function (req, file, callback) {
      uidSafe(24).then(function(uid) {
          callback(null, uid + path.extname(file.originalname))
      })
    }
});

const  uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
})

app.get('/', (req, res) => {
    res.redirect('/images')
})

app.get('/images', (req, res) => {
    getImages()
        .then( data => {
            res.json(data)
        })
        .catch(err => {
            console.log(err.message)
        })     
})

app.post('/upload', uploader.single('file'), upload, (req, res) => {
    let url = `${s3Url}${req.file.filename}` 
    addImage(url, req.body.username, req.body.title, req.body.description)
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            console.log(err.message)
        })
})

app.post('/allcomments', (req, res) => {
    getComments(req.body.imageID)
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            console.log(err.message)
        })
})

app.post('/comments', (req, res) => {
    addComment(req.body.username, req.body.comment, req.body.imageID)
    .then(data => { 
        res.json(data)
    })
    .catch(err => {
        console.log(err.message)
    })
})




app.listen(8080, () => console.log('server up and listen on port 8080'))