const { Sequelize, DataTypes } = require("sequelize");

// sql server
const sequelize = new Sequelize("NodeDB", "Eswin1205", "123456", {
  dialect: "mssql",
  //host: "192.168.xx",
  dialectOptions: {
    // Observe the need for this nested `options` field for MSSQL
    options: {
      // Your tedious options here
      useUTC: false,
      dateFirst: 1,
    },
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.berita = require("./berita")(sequelize, Sequelize);
db.comment1s = require("./comment1")(sequelize, Sequelize);
db.comment2s = require("./comment2")(sequelize, Sequelize);
db.users = require("./user")(sequelize, Sequelize);

module.exports = db;
