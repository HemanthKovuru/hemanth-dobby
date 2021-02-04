const Image = require("./../models/imageModel");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "backend/public/images");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    let err = new Error("please upload images only");
    err.statusCode = 400;
    cb(new Error(err));
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.alterImage = upload.single("image");

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.user) {
      let err = new Error("Please login to upload an image");
      err.statusCode = 301;
      return next(err);
    }

    // create an image
    if (req.file) {
      req.body.image = req.file.filename;
    }
    // console.log(req.file.filename);
    const image = await Image.create({
      name: req.body.name,
      user: req.user.id,
      image: req.body.image,
    });

    res.status(200).json({
      status: "success",
      data: {
        image,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllImages = async (req, res, next) => {
  try {
    const images = await Image.find({ user: req.user._id });

    res.status(200).json({
      status: "success",
      data: {
        images,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
