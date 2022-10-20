if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./userModel");
const app = express();
const db_URL = process.env.db_URL || "mongodb://localhost:27017/blindCoding";
const PORT = process.env.PORT || 3000;
const api = process.env.api_URL || "/api/v1";
mongoose
  .connect(db_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("We are Connected to Database");
  })
  .catch((err) => {
    console.log("Database Error!!");
    console.log(err);
  });
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get(`${api}`, (req, res) => {
  res.send("HI, Blind conding");
});

app.post(`${api}/register`, async (req, res) => {
  try {
    const data = req.body;
    const email = req.body.email;
    let user = await User.findOne({ email });
    if (!user) {
      user = new User(data);
      user.time = Date.now();
      await user.save();
      res.json({ user, difference: 3600 });
    } else {
      const current = Date.now();
      let difference = Math.floor(
        60 * 60 - (current / 1000 - user.time / 1000)
      );
      res.json({ user, difference });
    }
  } catch (e) {
    res.status(500).send(e);
  }
});
app.post(`${api}/submit`, async (req, res) => {
  try {
    const { email, code, num } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      res.statusCode = 401;
      res.json({ success: false });
    } else {
      if (num == 1){
        if (!user.code1) user.code1 = code;
      }
      else{
        if (!user.code2) user.code2 = code;
      }
      await user.save();
      res.send({ success: true });
    }
  } catch (e) {
    res.status(500).send(e);
  }
});
app.post(`${api}/disqualify`, async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (!user){
      res.status(500).send("User Not found");
      return;
    }
    user.disqualified = true;
    await user.save();
    res.send({ success: true });
  } catch (e) {
    res.status(500).send(e);
  }
});
app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
