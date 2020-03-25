const router = require("express").Router();

const Users = require("./users-model.js");
const restricted = require("../auth/restrict-middleware.js");

router.get("/", restricted, (req, res) => {
  const department = req.decodedToken.department;

  Users.findBy({ department })
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = router;