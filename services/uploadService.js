var mime = require("mime-types");
const multer = require("multer");
const path = require("path");

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + "." + mime.extension(file.mimetype)
    );
  },
});

var uploadService = multer({ storage: storage });

module.exports = uploadService;



// In html file add
// <form action="/index/uploadmultiple"  enctype="multipart/form-data" method="POST">
//   Select images: <input type="file" name="myFiles" multiple>
//   <input type="submit" value="Upload your files"/>
// </form>
//  