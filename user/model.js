const Sequelize = require("sequelize");
const db = require("../db");

const User = db.define("user", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  points: Sequelize.INTEGER,
  guessed: Sequelize.BOOLEAN,

});

module.exports = User;
