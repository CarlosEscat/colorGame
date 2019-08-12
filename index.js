const express = require("express");
//const Sse = require('json-sse')
const bodyParser = require("body-parser");
const cors = require("cors");
//const Sequelize = require("sequelize");
const userRouter = require("./user/router");
const roomRouter = require("./room/router");

User.belongsTo(Room);
Room.hasMany(User);
Room.Users = [{ name, password, points }];

const app = express();

const middleware = cors();
app.use(middleware);
const jsonParser = bodyParser.json();
app.use(jsonParser);

app.use(userRouter);
app.use(roomRouter);
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on :${port}`));
