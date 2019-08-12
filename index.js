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
  points: Sequelize.INTEGER
});

const Room = db.define("room", {
  name: Sequelize.STRING
});

User.belongsTo(Room);
Room.hasMany(User);

const app = express();

const middleware = cors();
app.use(middleware);
const jsonParser = bodyParser.json();
app.use(jsonParser);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on :${port}`));
