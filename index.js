<<<<<<< HEAD
const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const uidSafe = require('uid-safe')
const path = require('path')

const {s3Url} = require('./config') 
const {getImages, getImagesWithcommentCount, getImage, getImageWithCommentCount, addImage, getMoreImages, getMoreImagesWithCommentCount, isLastImage, deleteImage, getComments, addComment, addLike} = require('./db')
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
    getImagesWithcommentCount()
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            console.log(err.message)
        })     
})

app.post('/image', (req, res) => {
    getImageWithCommentCount(req.body.id)
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            console.log(err.message)
        })     
})

app.get('/lastimage', (req, res) => {
    isLastImage()
        .then(id => {
            res.json(id)
        })
        .catch(err => {
            console.log(err.message)
        })
})

app.post('/moreimages', (req, res) => {
    getMoreImagesWithCommentCount(req.body.lastID)
        .then(data => {
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

app.post('/like', (req, res) => {
    addLike(req.body.id, req.body.like)
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            console.log(err.message)
        })
})

app.post('/delete', (req, res) => {
    deleteImage(req.body.id)
    .then(result => {
    })
    .catch(err => {
        console.log(err.message)
    })
})




app.listen(8080, () => console.log('server up and listen on port 8080'))
=======
const express = require('express');
const app = express();

const s3 = require('./s3');
const config = require('./config');

const bodyParser = require('body-parser');

const modules = require('./modules');

var multer = require('multer');
var uidSafe = require('uid-safe');
var path = require('path');

var diskStorage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, __dirname + '/uploads');
  },
  filename: function(req, file, callback) {
    uidSafe(24).then(function(uid) {
      callback(null, uid + path.extname(file.originalname));
    });
  }
});

var uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2097152
  }
});

const db = require('./db.js');

app.use(bodyParser.json());

app.use(express.static('./public'));

app.get('/images', (req, res) => {
  db.getImages().then(response => {
    res.json(response.rows);
  });
});

app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {
  db.addImage(
    config.s3Url + req.file.filename,
    req.body.username,
    req.body.title,
    req.body.description
  )
    .then(({ rows }) => {
      res.json(rows[0]);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ error: 'Something failed!' });
    });
});

app.get('/get-image/:imageid', (req, res) => {
  db.getImage(req.params.imageid)
    .then(response => {
      response.rows[0].created_at = modules.niceDate(
        response.rows[0].created_at
      );
      res.json(response.rows);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.get('/images/more/:imageid', (req, res) => {
  db.getMoreImages(req.params.imageid)
    .then(response => {
      res.json(response.rows);
    })
    .catch(err => {
      console.log('error: ', err);
      res.status(500).send(err);
    });
});

app.get('/get-comments/:imageid', (req, res) => {
  db.getComments(req.params.imageid)
    .then(response => {
      for (var i = 0; i < response.rows.length; i++) {
        response.rows[i].created_at = modules.niceDate(
          response.rows[i].created_at
        );
      }
      res.json(response.rows);
    })
    .catch(err => console.log(err));
});

app.post('/comment/add', (req, res) => {
  db.addComment(req.body.username, req.body.comment, req.body.imageid)
    .then(response => {
      response.rows[0].created_at = modules.niceDate(
        response.rows[0].created_at
      );
      res.json(response.rows);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ error: 'Something failed!' });
    });
});

app.listen(process.env.PORT || 8080, () => console.log('listening!'));
>>>>>>> mcrippa2
