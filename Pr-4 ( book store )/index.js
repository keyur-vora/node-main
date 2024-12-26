const express = require("express");
const app = express();
const port = 8000;

// Mongo Connection
const connectDB = require("./config/db");
connectDB();

// Connect User Model / Collection
const movieModel = require("./models/movieModel");
const fs = require("fs");

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Static File Handling
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer Configuration
const multer = require("multer");
const { unlinkSync } = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqname = Date.now();
    cb(null, file.fieldname + "-" + uniqname);
  },
});
const fileUpload = multer({ storage }).single("image");

// Routes

// View Movies
app.get("/view", (req, res) => {
  movieModel
    .find({})
    .then((detail) => res.render("ViewStore", { detail }))
    .catch((err) => console.log(err));
});

// Add Movie Page
app.get("/", (req, res) => res.render("Addmovie"));

// Add Movie
app.post("/insertDetail", fileUpload, (req, res) => {
  const { name, price, duration, director } = req.body;
  movieModel
    .create({
      name,
      price,
      duration,
      director,
      image: req.file.path,
    })
    .then(() => res.redirect("/view"))
    .catch((err) => console.log(err));
});

// Delete Movie
app.get("/delete", (req, res) => {
  const deleteId = req.query.deleteId;

  movieModel
    .findById(deleteId)
    .then((single) => {
      try {
        fs.unlinkSync(single.image);
      } catch (err) {
        console.error("Error deleting file:", err);
      }
      return movieModel.findByIdAndDelete(deleteId);
    })
    .then(() => res.redirect("/view"))
    .catch((err) => console.log(err));
});

// Edit Movie Page
app.get("/edit", (req, res) => {
  const editId = req.query.editId;

  movieModel
    .findById(editId)
    .then((single) => res.render("Editmovie", { single }))
    .catch((err) => console.log(err));
});

// Update Movie
app.post("/updateDetail", fileUpload, (req, res) => {
  const { editid, name, price, duration, director } = req.body;

  const updateData = { name, price, duration, director };

  if (req.file) {
    movieModel
      .findById(editid)
      .then((single) => {
        try {
          fs.unlinkSync(single.image);
        } catch (err) {
          console.error("Error deleting file:", err);
        }
        updateData.image = req.file.path;
        return movieModel.findByIdAndUpdate(editid, updateData);
      })
      .then(() => res.redirect("/view"))
      .catch((err) => console.log(err));
  } else {
    movieModel
      .findByIdAndUpdate(editid, updateData)
      .then(() => res.redirect("/view"))
      .catch((err) => console.log(err));
  }
});

// Start Server
app.listen(port, () => console.log(`Server is running on port ${port}`));
