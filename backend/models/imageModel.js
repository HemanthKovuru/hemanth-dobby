const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide a image name"],
    trim: true,
    maxLength: 20,
  },
  image: {
    type: String,
    required: [true, "please provide a image."],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "please provide a user"],
  },
});

const Image = mongoose.model("Image", imageSchema);
module.exports = Image;
