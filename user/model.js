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
  points: { type: Sequelize.INTEGER, defaultValue: 0 },
  guessed: Sequelize.BOOLEAN
});

module.exports = User;
