const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); //<<<install this npm package

const Users = require("../users/users-model.js");
const { jwtSecret } = require("../config/secret.js");

router.post("/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token //send the token
        });
      } else {
        res.status(401).json({ message: "invalid credentials" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    department: user.department || "user"
  };

  const options = { expiresIn: "1h" };

  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;
