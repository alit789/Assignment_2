const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const port = 3000;

app.use(express.json());

const usersData = JSON.parse(fs.readFileSync("./users.json", "utf-8"));
// console.log(usersData);

function authUser(username, password) {
  const user = usersData.find(
    (user) => user.username === username && user.password === password
  );
  return user;
}

function authToken(req, res, next) {
  const token = req.header("Auth");
  console.log("Yout JWT Token : " + token);
  if (token === null) return res.status(401).json({ message: "Auth Gagal" });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user;
    next();
  });
}

const secretKey = "abcdefg";

// api post
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("Username : " + username, "Password : " + password);

  const user = authUser(username, password);

  if (user) {
    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

    res.status(200).json({ token: token });
    console.log("Token : " + token);
  } else {
    res.status(401).json({ message: "Auth Gagal" });
  }
});

// api getAllData
app.get("/getAllData", authToken, (req, res) => {
  const teachersData = JSON.parse(fs.readFileSync("./teachers.json", "utf-8"));
  res.json(teachersData);
});

app.listen(port, () => {
  console.log("Jalan Di Port : " + port);
});
