const express = require("express");
const mongoose = require("mongoose");
require("crypto").randomBytes(64).toString("hex");
const dotenv = require("dotenv");
const User = require("./api/models/User");
var cors = require("cors");

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
const routes = require("./api/routes");

const app = express();
app.use(cors());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.post("/auth/login", async (req, res) => {
  // ...
  console.log(req.body);
  const user = await User.findOne({ login: req.body.login });
  console.log(user.password.toString(), req.body.password.toString());

  if (user) {
    console.log(user.password.toString(), req.body.password.toString());
    if (user.password === req.body.password) {
      const token = generateAccessToken({ username: req.body.username });
      res.json(token);
    } else {
      res.status(401).send(res.json({ message: "Usuario ou senha invalida" }));
    }
  } else {
    res.status(401).send(res.json({ message: "Usuario ou senha invalida" }));
  }

  // ...
});

app.listen(5000, function () {
  console.log("listening on 5000");
});

app.use(routes);
