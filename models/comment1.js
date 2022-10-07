module.exports = (sequelize, Sequelize) => {
  const Comment1 = sequelize.define("comment1", {
    idberita: {
      type: Sequelize.INTEGER,
    },
    nama: {
      type: Sequelize.STRING,
    },
    isi: {
      type: Sequelize.TEXT,
    },
  });
  return Comment1;
};
