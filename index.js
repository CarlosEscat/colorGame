const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRouter = require("./user/router");
const loginRouter = require('./auth/router')
const roomFactory = require("./room/router");
const Sse = require('json-sse');
const Room = require('./room/model')
const User = require('./user/model')

const app = express();

const middleware = cors();
app.use(middleware);

const jsonParser = bodyParser.json();
app.use(jsonParser);

const stream = new Sse()
app.use(loginRouter)
app.use(userRouter);

const roomRouter = roomFactory(stream);
app.use(roomRouter);

app.get('/stream', async (request, response) => {

  const rooms = await Room.findAll({ include: [User] })

  const data = JSON.stringify(rooms)
  stream.updateInit(data)

  stream.init(request, response)
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on :${port}`));
