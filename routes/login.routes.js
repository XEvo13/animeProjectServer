const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

//LOGIN

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send({ error: "Please provide a email and password" });
    return;
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).send({ error: "User not found" });
    return;
  }

  const correctPassword = await bcrypt.compare(password, user.password);

  if (!correctPassword) {
    res.status(401).send({ error: "Password incorrect" });
    return;
  }

  const payload = {
    _id: user._id,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.SECRET_TOKEN, {
    expiresIn: "6h",
  });

  res.send({ authToken: token });
});

module.exports = router;
