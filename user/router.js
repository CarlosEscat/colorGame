const { Router } = require("express");
const User = require("./model");
const bcrypt = require("bcrypt");

function factory(stream) {
  const router = new Router();

  router.post("/user", (req, res, next) => {
    const user = {
      name: req.body.name,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    User.create(user)
      //.then(data => stream.send(data))
      .then(data => res.json(data))
      .catch(next);
  });

  return router;
}

module.exports = factory;
