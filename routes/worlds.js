const express = require("express");
const router = express();
const World = require("../models/Worlds");

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

router.get("/:id", async (req, res) => {
  let roles = [];

  roles = await World.find({ _id: req.params.id });

  return res.json(roles);
});

router.get("/", async (req, res) => {
  let roles = [];

  roles = await World.find({});

  return res.json(roles);
});

router.post("/", async (req, res) => {
  const resp = await World.create(req.body);
  res.json(resp);
});

router.delete("/:id", async (req, res) => {
  const resp = await World.deleteOne({ _id: req.params.id });

  res.json(resp);
});

router.put("/", (req, res) => {
  const data = req.body;

  World.findOneAndUpdate(
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
