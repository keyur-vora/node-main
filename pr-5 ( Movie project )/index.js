const express = require("express");
const app = express();
const port = 8000;

const databese = require("./config/db");
databese();

const MovieModel = require(`./models/movieModel`);
const fs = require("fs");

app.set("view engine", "ejs");

app.use(express.urlencoded());

const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const multer = require("multer");

const { unlinkSync } = require("fs");

const st = multer.diskStorage({
  destination: (req, res, cb) => {
    return cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniq = Math.floor(Math.random() * 1000000000);
    return cb(null, `${file.fieldname}-${uniq}`);
  },
});

const fileUpload = multer({ storage: st }).single("image");

app.get("/view", (req, res) => {
  MovieModel.find({})
    .then((detail) => {
      return res.render("viewMovie", {
        detail: detail,
      });
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
});

app.get("/", (req, res) => {
  return res.render("Deshbord");
});

app.get("/add", (req, res) => {
  return res.render("addMovie");
});

app.post("/insertdetail", fileUpload, (req, res) => {
  const { name, price, seats, description } = req.body;
  MovieModel.create({
    name,
    price,
    seats,
    description,
    image: req.file.path,
  })
    .then((data) => {
      console.log(data);
      return res.redirect("/view");
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
});

app.get("/delete", (req, res) => {
  const delid = req.query.deletId;

  MovieModel.findById(delid)
    .then((single) => {
      if (single && single.image) {
        fs.unlinkSync(single.image);
      }
      return MovieModel.findByIdAndDelete(delid);
    })
    .then(() => {
      return res.redirect("/view");
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
});

app.get("/edit", (req, res) => {
  const eid = req.query.editId;
  MovieModel.findById(eid)
    .then((single) => {
      return res.render("EditMovie", {
        single,
      });
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
});

app.post("/updateDetail", fileUpload, (req, res) => {
  const { editid, name, price, seats, description } = req.body;
  if (req.file) {
    MovieModel.findById(editid)
      .then((single) => {
        fs.unlinkSync(single.image);
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
    MovieModel.findByIdAndUpdate(editid, {
      name,
      price,
      seats,
      description,
      image: req.file.path,
    })
      .then((data) => {
        return res.redirect("/view");
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  } else {
    MovieModel.findById(editid)
      .then((single) => {
        return MovieModel.findByIdAndUpdate(editid, {
          name,
          price,
          seats,
          description,
          image: single.image,
        });
      })
      .then(() => {
        return res.redirect("/view");
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return false;
  }
  console.log(`server is start on port :- ${port}`);
});
