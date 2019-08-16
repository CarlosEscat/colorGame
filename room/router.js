const { Router } = require("express");
const Room = require("./model");
const User = require("../user/model");
const { toData } = require("../auth/jwt");

function factory(stream) {
  const router = new Router();
  const words = ["red", "green", "blue", "yellow"];

  //sends all the rooms with all the users in it to the stream/client
  async function update() {
    const rooms = await Room.findAll({ include: [User] });
    const data = JSON.stringify(rooms);
    stream.send(data);
  }

  router.post("/room", async (request, response) => {
    const room = await Room.create(request.body);

    await update();
    //not really nessasary, just for checking
    response.send(room);
  });

  router.put("/room/join/:id", async (request, response) => {
    const room = await Room.findByPk(request.params.id, { include: [User] });
    if (room.status === "joining" && room.users.length < 4) {
      const { jwt } = request.body;
      console.log("request.body test:", request.body);
      const { userId } = toData(jwt);
      const user = await User.findByPk(userId);
      const updated = await user.update({
        roomId: request.params.id,
        points: 0
      });

      await update();

      response.send(updated);
    } else {
      response
        .status(400)
        .send("Sorry, the game has already started. Try a different room.");
    }
  });

  async function newWord(room) {
    console.log("newWord test");
    for (let i = words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]];
    }
    //updates room status in started so no nobody can get's in the room.
    await room.update({
      status: "started",
      color: words[0],
      word: words[1],
      round: room.round + 1
    });

    await User.update({ guessed: false }, { where: { roomId: room.id } });
  }

  router.put("/room/start/:id", async (request, response) => {
    console.log("start test");
    const room = await Room.findByPk(request.params.id);

    if (room.status === "joining") {
      await newWord(room);
      await update();

      response.send("started");
    } else {
      response.send("This game cannot be started");
    }
  });

  router.put("/room/guess/:id", async (request, response) => {
    const { jwt, guess } = request.body;
    console.log("request.body test:", request.body);

    const { userId } = toData(jwt);
    const room = await Room.findByPk(request.params.id);
    console.log("room test:", room.dataValues);
    const user = await User.findByPk(userId);
    console.log("User test: ", user.dataValues);
    if (room.status === "started" || !user.guessed) {
      console.log("accepted");
      console.log("guess test", guess);
      console.log("room.word test", room.word);
      const correct = guess === room.color;
      console.log("correct test:", correct);
      const points = correct ? user.points + 1 : user.points + 0;
      console.log("points test:", points);

      const updatedUser = await User.update(
        { guessed: true, points },
        { where: { id: userId } }
      );
      const updatedRoom = await Room.findByPk(request.params.id, {
        include: [User]
      });

      const finished =
        correct || !updatedRoom.users.some(user => !user.guessed);

      console.log("finished test:", finished);

      if (finished) {
        room.round > 7
          ? await room.update({ status: "Game over!" })
          : await newWord(room);
      }

      await update();

      response.send({ updatedUser, updatedRoom });
    } else {
      await user.update({ guessed: false });
      response.send("This game is not in play");
    }
  });

  // router.update(
  //   '/room/end/:id',
  //   async (request, response) => {
  //     if (room.users === 0) {
  //       ?
  //       :
  //     }

  //   }
  // )

  return router;
}
module.exports = factory;
