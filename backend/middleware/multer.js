// /Users/macbook1/Desktop/sodia/backend/middleware/multer.js

const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'ap-south-1',
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'sodia-post-images',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const fileName = Date.now().toString() + '-' + file.originalname;
      cb(null, fileName);
    },
  }),
});

module.exports = upload;
