module.exports = (sequelize, Sequelize) => {
  const Comment2 = sequelize.define("comment2", {
    idberita1: {
      type: Sequelize.INTEGER,
    },
    idcomment: {
      type: Sequelize.STRING,
    },
    nama1: {
      type: Sequelize.STRING,
    },
    balas: {
      type: Sequelize.TEXT,
    },
  });
  return Comment2;
};
