const multer = require("multer");
const path = require("path");

let storageMulter = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log("__dirNmae From MulterFile Middlewares", __dirname);
        callback(null, path.join(__dirname,'../upload'));
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

exports.upload = multer({ storage: storageMulter });
