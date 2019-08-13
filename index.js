const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRouter = require("./user/router");
const loginRouter = require('./auth/router')
const roomFactory = require("./room/router");

const app = express();

const middleware = cors();
app.use(middleware);
const jsonParser = bodyParser.json();
app.use(jsonParser);

app.use(loginRouter)
app.use(userRouter);


const roomRouter = roomFactory(stream);
app.use(roomRouter);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on :${port}`));
