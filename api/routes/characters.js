const express = require("express");
const router = express();
const Character = require("../models/Character");

const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

router.get("/:id", authenticateToken, async (req, res) => {
  let roles = [];

  roles = await Character.find({ _id: req.params.id });

  return res.json(roles);
});

router.get("/", authenticateToken, async (req, res) => {
  let roles = [];

  roles = await Character.find({});

  return res.json(roles);
});

router.post("/", authenticateToken, async (req, res) => {
  const resp = await Character.create(req.body);
  res.json(resp);
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const resp = await Character.deleteOne({ _id: req.params.id });

  res.json(resp);
});

router.put("/", authenticateToken, (req, res) => {
  const data = req.body;

  Character.findOneAndUpdate(
    { _id: data._id },
    data,
    { upsert: true },
    function (err, doc) {
      if (err) return res.send(500, { error: err });
      return res.send("Succesfully saved.");
    }
  );
});

module.exports = router;
