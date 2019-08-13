const express = require("express");
const Sse = require("json-sse");
const bodyParser = require("body-parser");
const cors = require("cors");
const userFactory = require("./user/router");
const roomFactory = require("./room/router");

const stream = new Sse();

const app = express();

const middleware = cors();
app.use(middleware);
const jsonParser = bodyParser.json();
app.use(jsonParser);

const userRouter = userFactory(stream);
app.use(userRouter);

const roomRouter = roomFactory(stream);
app.use(roomRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on :${port}`));
