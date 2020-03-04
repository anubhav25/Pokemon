const express = require("express");
const fs = require("fs");

const path = require("path");
const app = express();
const port = process.env.PORT || 8000;
const { Pokemon, filterTop10, WriteData, ReadData, CORS } = require("./helper");
let data = ReadData();

// to parse the incoming req body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// to enable CORS
app.use(CORS);

// serve static js css files
app.use(express.static(path.join(__dirname, "build")));

// search query
app.get("/search/:query", (req, res) => {
  let { query } = req.params;
  query = query && query.toLowerCase();
  query = query.split(" ");
  res.json({
    data: query
      ? filterTop10(
          data,
          x =>
            query.some(q => x.name.english.toLowerCase().includes(q)) ||
            query.every(q =>
              x.type
                .join(" ")
                .toLowerCase()
                .includes(q)
            )
        )
      : []
  });
});
// to get data based on page number and no. of items per page
app.get("/data", (req, res) => {
  let { page_size, page } = req.query;
  page_size = +page_size || 10;
  page = +page || 1;
  let total_items = data.length;
  if (page > Math.ceil(total_items / page_size)) {
    page = 1;
  }
  let startIndex = (page - 1) * page_size;
  let lastIndex = page * page_size;
  res.json({
    total_items,
    page,
    page_size,
    data: data.slice(startIndex, lastIndex)
  });
});

// add a new Pokemon
app.put("/pokemon", async (req, res) => {
  try {
    let id = data[data.length - 1].id + 1;
    let { name, type, attack, defense, description } = req.body;
    console.log(id, { name, type, attack, defense });
    if (id && name && type && attack && defense) {
      data.push(Pokemon(id, name, type, attack, defense, description));
      await WriteData(data);
      return res.json({ result: true });
    }
  } catch (e) {
    console.log(e);
  }
  return res.json({ result: false });
});

//to update a new pokemon
app.patch("/pokemon/:id", async (req, res) => {
  try {
    let id = +req.params.id;
    let { name, type, attack, defense, description } = req.body;
    let obj = data.find(x => x.id === id);
    if (obj) {
      if (name) {
        obj.name.english = name;
      }
      if (type) {
        type = type
          .replace(/,/g, " ")
          .split(" ")
          .filter(Boolean);
        obj.type = type;
      }
      if (description) {
        obj.description = description;
      }
      if (attack) {
        obj.base.Attack = attack;
      }
      if (defense) {
        obj.base.Defense = defense;
      }
      await WriteData(data);
      return res.json({ result: true });
    }
  } catch {}
  return res.json({ result: false });
});

// to delete a pokemon
app.delete("/pokemon/:id", async (req, res) => {
  try {
    let id = +req.params.id;
    data = data.filter(x => x.id !== id);
    await WriteData(data);
    return res.json({ result: true });
  } catch {}
  return res.json({ result: false });
});

// send react frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// start server
app.listen(port, () => {
  console.log("listening on port ", port);
});
