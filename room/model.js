const Sequelize = require("sequelize");
const db = require("../db");
const User = require("../user/model");

const Room = db.define("room", {
  word: Sequelize.STRING,
  color: Sequelize.STRING,
  status: { type: Sequelize.STRING, defaultValue: "joinning" },
  round: { type: Sequelize.INTEGER, defaultValue: 0 }
});

User.belongsTo(Room);
Room.hasMany(User);
Room.Users = [{ name, password, points }];

module.exports = Room;
