const express = require("express");
const router = express();
const Item = require("../models/Item");

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
  return res.json(await Item.findById(req.params.id));
});

router.get("/", authenticateToken, async (req, res) => {
  return res.json(await Item.find({}));
});

router.post("/", authenticateToken, async (req, res) => {
  const resp = await Item.create(req.body);
  res.json(resp);
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const resp = await Item.deleteOne({ _id: req.params.id });

  res.json(resp);
});

router.patch("/", authenticateToken, async (req, res) => {
  const data = req.body;

  await Item.findOneAndUpdate(
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
