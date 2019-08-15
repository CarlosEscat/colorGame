const { Router } = require('express')
const User = require('./model')
const bcrypt = require('bcrypt')

const router = new Router()

router.post('/user', (req, res, next) => {
  const user = {
    name: req.body.name,
    password: bcrypt.hashSync(req.body.password, 10)
  }

  User.create(user)
    .then(userList => {
      return res.send(userList)
    })
});

module.exports = router
