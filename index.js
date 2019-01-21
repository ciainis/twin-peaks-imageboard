const express = require('express')
const bodyParser = require('body-parser')

const {getImages} = require('./db')

const app = express()

app.use(bodyParser.json())
app.use(express.static('./public'))

app.get('/', (req, res) => {
    res.redirect('/images')
})

app.get('/images', (req, res) => {
    getImages()
        .then( data => {
            res.json(data)
        })     
})




app.listen(8080, () => console.log('server up and listen on port 8080'))