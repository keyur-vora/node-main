const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number, // Changed to Number for better type safety
    required: true,
  },
  pages: {
    type: Number, // Changed to Number for better type safety
    required: true,
  },
  author: {
    type: String,
    required: true, // Fixed the typo here
  },
  image: {
    type: String,
    required: true,
  },
});

// Updated model name to "Movie" for better consistency
const Movie = mongoose.model("Movie", userSchema);

module.exports = Movie;
