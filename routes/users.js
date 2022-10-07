var express = require("express");
var multer = require("multer");
var router = express.Router();

const db = require("../models");
const Berita = db.berita;
const Comment1 = db.comment1s;
const Op = db.Sequelize.Op;

/* tampilan awal
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
*/

router.get("/berita", function (req, res, next) {
  Berita.findAll()
    .then((berita) => {
      res.render(berita);
    })
    .catch((err) => {
      res.json({
        info: "Error",
        message: err.message,
      });
    });
});

// router.get("/tambahberita", function (req, res, next) {
//   res.render("tambahberita", { title: "Tambah Berita" });
// });
router.post("/tambahberita", function (req, res, next) {
  var berita = {
    judul: req.body.judul,
    deskripsi: req.body.deskripsi,
    isi: req.body.isi,
    gambar: req.body.gambar,
  };
  Berita.create(berita)
    .then((data) => {
      res.send("data");
    })
    .catch((err) => {
      res.json({
        info: "Error",
        message: err.message,
      });
    });
});

//tambah berita
// router.get("/berhasil", function (req, res, next) {
//   response.render("tambahberita", { title: "Mendaftar Berita" });
// });

router.post("/berhasil", function (request, response, next) {
  var storage = multer.diskStorage({
    destination: function (request, file, callback) {
      callback(null, "./upload");
    },
    filename: function (request, file, callback) {
      var temp_file_arr = file.originalname.split(".");
      var temp_file_name = temp_file_arr[0];
      var temp_file_extension = temp_file_arr[1];
      callback(null, temp_file_name + "-" + Date.now() + "." + temp_file_extension);
    },
  });
  var upload = multer({ storage: storage }).single("gambar");
  upload(request, response, function (error) {
    if (error) {
      return response.end("Error Uploading File");
    } else {
      response.redirect("/tambahberita");
    }
  });
});

router.get("/baca/:id", function (req, res, next) {
  var id = parseInt(req.params.id);
  Berita.findByPk(id)
    .then((baca) => {
      if (baca) {
        res.send(baca);
      } else {
        // http 404 not found
        res.render("baca", {
          title: "Baca Produk",
          berita: {},
        });
      }
    })
    .catch((err) => {
      res.json({
        info: "Error",
        message: err.message,
      });
    });
});

router.delete("/deleteproduct/:id", function (req, res, next) {
  var id = parseInt(req.params.id); // /detail/2, /detail/3

  Berita.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num > 0) {
        res.send({ message: "data telah dihapus" });
      } else {
        // http 404 not found
        res.status(404).send({
          message: "Tidak ada data id=" + id,
        });
      }
    })
    .catch((err) => {
      res.json({
        info: "Error",
        message: err.message,
      });
    });
});

router.get("/editberita/:id", function (req, res, next) {
  var id = parseInt(req.params.id); // /detail/2, /detail/3

  Berita.findByPk(id)
    .then((detailBerita) => {
      if (data) {
        res.send(data);
      } else {
        // http 404 not found
        res.status(404).send({
          message: "Tidak ada data id=" + id,
        });
      }
    })
    .catch((err) => {
      res.json({
        info: "Error",
        message: err.message,
      });
    });
});
router.put("/editberita/:id", function (req, res, next) {
  var id = parseInt(req.params.id); // /detail/2, /detail/3

  Product.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num > 0) {
        res.send({ message: "data diperbarui" });
      } else {
        // http 404 not found
        res.status(404).send({
          message: "Tidak ada data id=" + id,
        });
      }
    })
    .catch((err) => {
      res.json({
        info: "Error",
        message: err.message,
      });
    });
});
module.exports = router;
