const express = require("express");
const mongoose = require("mongoose");
require("crypto").randomBytes(64).toString("hex");
const dotenv = require("dotenv");
const User = require("./models/User");

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET;
function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
}

mongoose.connect(
  "mongodb+srv://medicwall:medicwall@cluster0mw-swhi2.gcp.mongodb.net/medicwall?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const jwt = require("jsonwebtoken");
const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.post("/auth", async (req, res) => {
  // ...
  const user = await User.findOne({ login: req.body.login });
  console.log(user);
  if (user) {
    console.log(user.password.toString(), req.body.password.toString());
    if (user.password === req.body.password) {
      const token = generateAccessToken({ username: req.body.username });
      res.json(token);
    } else {
      res.send(401, "Usuario ou senha invalida");
    }
  }

  // ...
});

app.listen(3000, function () {
  console.log("listening on 3000");
});

app.use(routes);
