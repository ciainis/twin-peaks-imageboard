const knox = require('knox');
const fs = require('fs');

let secrets = require('./secrets'); // secrets.json is in .gitignore

const client = knox.createClient({
  key: process.env.AWS_KEY || secrets.AWS_KEY,
  secret: process.env.AWS_SECRET || secrets.AWS_SECRET,
  bucket: 'espressocup'
});

module.exports.upload = (req, res, next) => {
  if (!req.file) {
    console.log('Multer failed');
    return res.sendStatus(500);
  }
  const s3Request = client.put(req.file.filename, {
    'Content-Type': req.file.mimetype,
    'Content-Length': req.file.size,
    'x-amz-acl': 'public-read'
  });

  const readStream = fs.createReadStream(req.file.path);
  readStream.pipe(s3Request);

  s3Request.on('response', s3Response => {
    if (s3Response.statusCode == 200) {
      next();
      fs.unlink(req.file.path, () => {});
    } else {
      console.log(s3Response.statusCode);
      res.sendStatus(500);
    }
  });
};
