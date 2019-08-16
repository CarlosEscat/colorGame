const { Router } = require("express");
const Room = require("./model");
const User = require('../user/model')

function factory(stream) {
  const router = new Router();
  const words = ['red', 'green', 'blue', 'yellow']

  //sends all the rooms with all the users in it to the stream/client
  async function update () {
    const rooms = await Room.findAll({ include: [User] })
    const data = JSON.stringify(rooms)
    stream.send(data)
  }

  router.post(
    '/room',
    async (request, response) => {
      const room = await Room.create(request.body)

      await update()
//not really nessasary, just for checking
      response.send(room)
    }
  )

  router.put(
    '/room/join/:id', 
      async (request, response) => {
        const room = await Room.findByPk(request.params.id)
        if (room.status === 'joining' && room.users.length < 4) {
            const { userId } = request.body
            const user = await User.findByPk(userId)
            const updated = await user.update({ roomId: request.params.id, points: 0 })
            
            await update()

            response.send(updated)
        } else {
          response.status(400).send('Sorry, the game has already started. Try a different room.')
        }
    }
  )

  async function newWord (room) {
    for (let i = words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]];
    }
    //updates room status in started so no nobody can get's in the room.
    return room.update({
      status: 'started',
      color: words[0],
      word: words[1],
      round: round + 1
    })
  }

  router.put(
    '/room/start/:id', 
      async (request, response) => {
        const room = await Room.findByPk(request.params.id)

        if (room.status === 'joining') {

          await newWord(room)
          await update()
          response.send(updated)
        }
      }
  )

  router.put(
    'room/guess/:id', 
    async (request, response) => {
      const { userId, guess } = request.body
      const room = await Room.findByPk(request.params.id)
      const user = await User.findByPk(userId)

      if (room.status === 'started' || !user.guessed) {
        const correct = guess === room.word
        const points = correct
          ? user.points + 1
          : user.points + 0
        
        const updatedUser = await User.update({ guessed: true, points })
        const updatedRoom = await Room.findByPk(request.params.id)

        const finished = correct || !updatedRoom.users.some(user => !user.guessed)
        
        if (finished) {
          const updated = round > 7
            ? await room.update({ status: 'Game over!' })
            : await newWord(room)

          await update()

          response.send({ updated, updatedUser })
        }
      }
    }
  )

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
