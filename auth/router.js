const { Router } = require('express')
const { toJWT, toData } = require('./jwt')
const bcrypt = require('bcrypt')
const User = require('../user/model')
const auth = require('./middleware')

const router = new Router()

router.post('/login', (req, res) => {
  const name = req.body.name
  const password = req.body.password

  if (!name || !password) {
    res.status(400).send({
      message: 'Please supply a valid name and password'
    })
  }
  else {
    User
      .findOne({
        where: {
          name: req.body.name
        }
      })
      .then(entity => {
        if (!entity) {
          res.status(400).send({
            message: 'User with that name does not exist'
          })
        }

        // 2. use bcrypt.compareSync to check the password against the stored hash
        if (bcrypt.compareSync(req.body.password, entity.password)) {

          // 3. if the password is correct, return a JWT with the userId of the user (user.id)
          res.send({
            jwt: toJWT({ userId: entity.id })
          })
        }
        else {
          res.status(400).send({
            message: 'Password was incorrect'
          })
        }
      })
      .catch(err => {
        console.error(err)
        res.status(500).send({
          message: 'Something went wrong'
        })
      })
  }
})

router.get('/secret-endpoint', auth, (req, res) => {
  res.send({
    message: `Thanks for visiting the secret endpoint ${req.user.name}.`,
  })
})

module.exports = router