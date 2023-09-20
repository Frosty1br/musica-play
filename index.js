require("dotenv").config();
const express = require("express");
const connetToDb = require("./database/db");
const session = require("express-session");
const bodyParser = require("body-parser");

const port = process.env.PORT || 3000;
const path = require("path");
const app = express();
const Music = require("./model/Music");
const Logindb = require("./model/Logindb");

let music = null;
let musicDel = null;

app.use(session({ secret: "aghdjfskglgfjhyuikk" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded());

connetToDb();

app.get("/", async (req, res) => {
  if (req.session.login) {
    const playlist = await Music.find();
    res.render("index", { playlist });
  } else {
    res.redirect("login");
  }
});

app.get("/login", (req, res) => {
  if (req.session.login) {
    res.redirect("/");
  } else {
    res.render("login.html");
  }
});

app.post("/login", async (req, res) => {
  try {
    const check = await Logindb.findOne({ name: req.body.name });

    if (check.password === req.body.password) {
      console.log(`Usuário ${check.name} Logado com sucesso`);

      req.session.login = req.body.name;

      res.redirect("/");
    } else {
      res.render("login.html");
    }
  } catch {
    res.render("login.html");
  }
});

// Criar na mongodb a conta de acesso
// const data={
//   name:req.body.name,
//   password:req.body.password
// }
// await Logindb.create(data);

app.get("/admin", async (req, res) => {
  if (req.session.login) {
    const playlist = await Music.find();
    res.render("admin", { playlist, music: null, musicDel: null });
  } else {
    res.redirect("login");
  }
});

app.post("/create", async (req, res) => {
  if (req.session.login) {
    const music = req.body;
    await Music.create(music);
    res.redirect("/");
  } else {
    res.redirect("login");
  }
});

app.get("/by/:id/:action", async (req, res) => {
  if (req.session.login) {
    const { id, action } = req.params;
    music = await Music.findById({ _id: id });
    const playlist = await Music.find();
    if (action == "edit") {
      res.render("admin", { playlist, music, musicDel: null });
    } else {
      res.render("admin", { playlist, music: null, musicDel: music });
    }
  } else {
    res.redirect("login");
  }
});

app.post("/update/:id", async (req, res) => {
  if (req.session.login) {
    const newMusic = req.body;
    await Music.updateOne({ _id: req.params.id }, newMusic);
    res.redirect("/admin");
  } else {
    res.redirect("login");
  }
});

app.get("/delete/:id", async (req, res) => {
  if (req.session.login) {
    await Music.deleteOne({ _id: req.params.id });
    res.redirect("/admin");
  } else {
    res.redirect("login");
  }
});

app.listen(port, () =>
  console.log(`Servidor rodando em http://localhost:${port}`)
);
