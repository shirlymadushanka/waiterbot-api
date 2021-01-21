const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const mime = require('mime-types');

const s3Config = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  Bucket: process.env.AWS_BUCKET_NAME
});


var uploader = multer({
  storage: multerS3({
    s3: s3Config,
    acl: "public-read",
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      let base = "";
      switch (req.baseUrl) {
        case "/api/properties":
          base = `${req.user.user_id}/properties/${req.params.propId}`;
          break;
      
        default:
          var now = Date.now().toString();
          base = `${req.user.user_id}/${now}`
          break;
      }
      var fileName = base + "." + mime.extension(file.mimetype);
      console.log(fileName);
      cb(null, fileName);
    }
  })
})

module.exports = {
  uploader,
  s3Config
}