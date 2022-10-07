var express = require("express");
var router = express.Router();
var multer = require("multer");
const moment = require("moment");
var bcrypt = require("bcryptjs");

const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "././public/images");
  },
  filename: (req, file, callback) => {
    callback(null, new Date().getTime() + "-" + file.originalname);
  },
});

const kirim = multer({
  storage: fileStorage,
});

const db = require("../models");
const { comment1s, comment2s } = require("../models");
const Berita = db.berita;
const Comment1s = db.comment1s;
const Comment2s = db.comment2s;
const User = db.users;

const Op = db.Sequelize.Op;

/* GET Halaman Utama dan menu login */
router.get("/", function (req, res, next) {
  //   res.render("loginform", { title: "Daftar Berita" });
  // });
  User.findAll({
    attributes: ["name", "email", "username"],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.json({
        info: "Error",
        message: err.message,
      });
    });
});

router.get("/berita", function (req, res, next) {
  Berita.findAll()
    .then((berita) => {
      res.send(berita);
    })
    .catch((err) => {
      res.json({
        info: "Error",
        message: err.message,
      });
    });
});

//tambah berita
// router.get("/tambahberita", function (req, res, next) {
//   res.render("tambahberita", { title: "Tambah Berita" });
// });

router.post("/tambahberita", kirim.array("gambar", 1), function (req, res, next) {
  let gambar = req.files[0].filename;

  let berita = {
    judul: req.body.judul,
    deskripsi: req.body.deskripsi,
    isi: req.body.isi,
    gambar: gambar,
  };
  Berita.create(berita)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.json({
        info: "Error",
        message: err.message,
      });
    });
});

router.get("/baca/:id", async function (req, res, next) {
  var id = req.params.id;
  var nama = req.params.nama;
  const komentarr = await Comment1s.findAll({ where: { idberita: id } });
  await Berita.findByPk(id)
    .then((baca) => {
      if (baca) {
        res.send(baca);
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

router.delete("/deleteberita/:id", function (req, res, next) {
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
      res.status(404).send({
        message: "Tidak ada data id=" + id,
      });
    });
});

router.get("/editberita/:id", function (req, res, next) {
  const id = parseInt(req.params.id);
  Berita.findByPk(id)
    .then((berita) => {
      if (berita) {
        res.send(berita);
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
router.put("/editberita/:id", kirim.array("gambar", 1), function (req, res, next) {
  const id = parseInt(req.params.id);
  let gambar = req.files[0].filename;
  let berita = {
    judul: req.body.judul,
    deskripsi: req.body.deskripsi,
    isi: req.body.isi,
    gambar: gambar,
  };
  Berita.update(berita, {
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

router.post("/comment", function (req, res, next) {
  let comment = {
    idberita: req.body.idberita,
    nama: req.body.nama,
    isi: req.body.isi,
  };
  Comment1s.create(comment)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.json({
        info: "Error",
        message: err.message,
      });
    });
});

router.post("/balas", function (req, res, next) {
  let comment1 = {
    idcomment: req.body.idcomment,
    nama1: req.body.nama1,
    balas: req.body.balas,
  };
  Comment2s.create(comment1)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.json({
        info: "Error",
        message: err.message,
      });
    });
});

// login & Register
//

router.post("/register", function (req, res, next) {
  if (!(req.body.name && req.body.username && req.body.email && req.body.password)) {
    return res.status(400).json({
      message: "data tidak lengkap",
    });
  }
  var hashpass = bcrypt.hashSync(req.body.password, 8);
  var user = {
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: hashpass,
  };
  User.create(user)
    .then((data) => {
      res.send({
        id: data.id,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
      });
    })
    .catch((err) => {
      res.json({
        info: "Error",
        message: err.message,
      });
    });
});

// disini login username all

router.get("/login", function (req, res, next) {
  User.findAll({
    attributes: ["name", "email", "username"],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.json({
        info: "Error",
        message: err.message,
      });
    });
});

/*
router.get("/login", function (req, res, next) {
  if (!(req.body.username && req.body.password)) {
    return res.status(400).json({
      message: "data tidak lengkap",
    });
  }
  User.findOne({ where: { username: req.body.username } })
    .then((data) => {
      if (data) {
        var loginValid = bcrypt.compareSync(req.body.password, data.password);
        if (loginValid) {
          res.send(loginValid);
        } else {
          res.json({ login: "username/password salah" });
        }
      } else {
        res.json({ login: "username/password salah" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: "terjadi kegagalan sistem" });
    });
});
*/

//
router.put("/update", function (req, res, next) {
  if (!(req.body.name && req.body.email && req.body.username)) {
    return res.status(400).json({
      message: "data tidak lengkap",
    });
  }
  var user = {
    name: req.body.name,
    email: req.body.email,
  };
  User.update(user, {
    where: { username: req.body.username },
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

//delete
router.delete("/:id", function (req, res, next) {
  const id = req.params.id;

  User.destroy({
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

module.exports = router;
