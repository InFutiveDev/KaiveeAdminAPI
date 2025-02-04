const formidable = require("formidable");

const handleFormData = (req, res, next) => {
  const form = formidable({ multiples: true });
  
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    

    // !! Bellow req.files and req.fileds for next And Use in Next Route Function as data
    req.files = files;
    req.data = fields;
    // console.log("fieldsTextData-->", fields);
    // console.log("fileData-->", files);
    next();
  });
};

module.exports = { handleFormData };

