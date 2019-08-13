const Sequelize = require("sequelize");
const db = require("../db");

const Room = db.define(
  "room", {
    word: Sequelize.STRING,
    color: Sequelize.STRING,
    status: { type: Sequelize.STRING, defaultValue: "joinning" },
    round: { type: Sequelize.INTEGER, defaultValue: 0 }
  });

module.exports = Room;
