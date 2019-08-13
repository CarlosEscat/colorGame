// const { Router } = require("express");
// const Room = require("./model");
// const router = new Router();

// const words = ['red', 'green', 'blue', 'yellow']

// router.post(
//   '/room',
//   async (request, response) => {
//     const room = await Room.create(request.body)

//     const rooms = await Room.findAll({
//       include: [Room.id]
//     })

//     const data = JSON.stringify(rooms)

//     stream.updateInit(data)
//     stream.send(data)

//     response.send(room)
//   }
// )

// router.put(
//   '/room/join/:id', (request, response) => {
//     const room = await Room.findByPk(request.params.id)
//     if (room.status === 'joining') {
//         const { userId } = request.body
//         const user = await User.findByPk(userId)
//         const updated = await user.update({ roomId: request.params.id, points: 0 })
//     } else {
//       response.status(400).send('Sorry, the game has already started.')
//     }
//   }
// )

// router.put(
//   '/room/start/:id', (request, response) => {
//     const room = await Room.findByPk(request.params.id)
//     if (room.status === 'joining') {
//       const shuffled = shuffle(colors)
//       await room.update({
//         status: 'started',
//         color: shuffled[0],
//         word: shuffled[1]
//       })
//     }
//   }
// )

// router.put(
//   'room/guess/:id', (request, response) => {
//     const { userId, guess } = request.body
//     const room = await Room.findByPk(request.params.id)
//     const user = await User.findByPk(userId)

//     if (room.status === 'started' || user.guessed) {
//       const correct = guess === room.word
//       const points = correct
//         ? user.points + 1
//         : user.points - 1

//     const updatedUser = await User.update({ guessed: true, points })
//     const updatedRoom = await Room.findByPk(request.params.id)

//     const finished = correct || !updatedRoom.users.some(user => !user.guessed)
    
//     if (finished) {
//       const round = room.round + 1
//       const shuffled = shuffle(colors)

//       const updated = round > 6
//         ? await room.update({
//           color: shuffled[0],
//           word: shuffled[1],
//         })
//         : await room.update({ status: 'done' })

//     response.send(updated)
//     }
//     }
//   }
// )




// module.exports = router;
