const { Router } = require("express");
const Room = require("./model");
const User = require('../user/model')

function factory(stream) {
  const router = new Router();
  const words = ['red', 'green', 'blue', 'yellow']

  router.post(
    '/room',
    async (request, response) => {
      const room = await Room.create(request.body)
      const rooms = await Room.findAll()
      const data = JSON.stringify(rooms)

      stream.updateInit(data)
      stream.send(data)

      response.send(room)
    }
  )

  router.get(
    '/room',
    async (request, response) => {
      const rooms = await Room.findAll({ include: User.id })
      const data = JSON.stringify(rooms)

      response.send(data)
    }
  )

  router.put(
    '/room/join/:id', 
      async (request, response) => {
        const room = await Room.findByPk(request.params.id)
        if (room.status === 'joining') {
            const { userId } = request.body
            const user = await User.findByPk(userId)
            const updated = await user.update({ roomId: request.params.id, points: 0 })
            
            stream.updateInit(updated)
            response.send(updated)
        } else {
          response.status(400).send('Sorry, the game has already started. Try a different room.')
        }
    }
  )

  router.put(
    '/room/start/:id', 
      async (request, response) => {
        const room = await Room.findByPk(request.params.id)

        if (room.status === 'joining') {
          //test if this function works (maybe there has to be a parameter?)
          function shuffle() { 
            return Math.floor(Math.random() * 5);  
          }
          const shuffled = words[shuffle]
          //updates room status in started so no nobody can get's in the room.
          await room.update({
            status: 'started',
            color: shuffled[0],
            word: shuffled[1]
          })
        }
      }
  )

  router.put(
    'room/guess/:id', 
        async (request, response) => {
        const { userId, guess } = request.body
        const room = await Room.findByPk(request.params.id)
        const user = await User.findByPk(userId)

        if (room.status === 'started' || user.guessed) {
          const correct = guess === room.word
          const points = correct
            ? user.points + 1
            : user.points + 0

        const updatedUser = await User.update({ guessed: true, points })
        const updatedRoom = await Room.findByPk(request.params.id)

        const finished = correct || !updatedRoom.users.some(user => !user.guessed)
        
        if (finished) {
          const round = room.round + 1
          //same function as before
          function shuffle() { 
            return Math.floor(Math.random() * 5);  
          }
          const shuffled = words[shuffle]

          const updated = round > 6
            ? await room.update({
              color: shuffled[0],
              word: shuffled[1],
            })
            : await room.update({ status: 'Game over!' })

        response.send(updated)
        stream.updateInit(updatedUser)
        }
        }
      }
  )
  return router;
}
module.exports = factory;
