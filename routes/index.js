const express = require("express");
const router = express.Router();

const worlds = require("./worlds");
const characters = require("./characters");
const items = require("./items");

router.use("/worlds", worlds);
router.use("/characters", characters);
router.use("/items", items);

module.exports = router;
