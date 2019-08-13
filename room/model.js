const Sequelize = require("sequelize");
const db = require("../db");
const User = require("../user/model");

const Room = db.define("room", {
  //roomName: Sequelize.STRING,
  word: Sequelize.STRING,
  color: Sequelize.STRING,
  status: { type: Sequelize.STRING, defaultValue: "joinning" },
  round: { type: Sequelize.INTEGER, defaultValue: 0 }
});

User.belongsTo(Room);
Room.hasMany(User);
//console.log('Room.users test', Room.Users)
//Room.Users = [{ name, password, points }];

module.exports = Room;
