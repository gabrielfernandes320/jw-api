const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  value: String,
  description: String,
  type: String,
});

module.exports = mongoose.model("Item", ItemSchema);
