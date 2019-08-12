const express = require("express");
//const Sse = require('json-sse')
const bodyParser = require("body-parser");
const cors = require("cors");
const Sequelize = require("sequelize");

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgres://postgres:secret@localhost:5432/postgres";
const db = new Sequelize(databaseUrl);

db.sync({ force: false }).then(() => console.log("Database synced"));

const User = db.define("user", {
  name: Sequelize.STRING,
  password: Sequelize.STRING,
  points: Sequelize.INTEGER,
  guessed: Sequelize.BOOLEAN
});

const Room = db.define("room", {
  word: Sequelize.STRING,
  color: Sequelize.STRING,
  status: { type: Sequelize.STRING, defaultValue: "joinning" },
  round: { type: Sequelize.INTEGER, defaultValue: 0 }
});

User.belongsTo(Room);
Room.hasMany(User);
Room.Users = [{ name, password, points }];

const app = express();

const middleware = cors();
app.use(middleware);
const jsonParser = bodyParser.json();
app.use(jsonParser);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on :${port}`));
