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

router.get("/:id", authenticateToken, async (req, res) => {
  return res.json(await World.findById(req.params.id));
});

router.get("/", authenticateToken, async (req, res) => {
  let roles = [];

  roles = await World.find({});

  return res.json(roles);
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const resp = await World.create(req.body);
    res.json(resp);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const resp = await World.deleteOne({ _id: req.params.id });

  res.json(resp);
});

router.patch("/", authenticateToken, async (req, res) => {
  const data = req.body;

  await World.findOneAndUpdate(
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
