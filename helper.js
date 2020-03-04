// function to return a new Pokemon object
function Pokemon(id, name, type, attack, defense, description) {
  return {
    id: id,
    description: description || "",
    name: { english: name, japanese: "", chinese: "" },
    type: type
      .replace(/,/, " ")
      .split(" ")
      .filter(Boolean),
    base: {
      HP: 0,
      Attack: attack,
      Defense: defense,
      "Sp. Attack": 0,
      "Sp. Defense": 0,
      Speed: 0
    }
  };
}
// function to readData from json file
function ReadData() {
  let data;
  try {
    data = require("./pokedex.json");
  } catch {
    data = [];
  }
  return data;
}
// function to writeData to json file
function WriteAllData(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile("./pokedex.json", JSON.stringify(data), err => {
      if (err) reject(err);
      resolve();
    });
  });
}

// wrapper to WriteAllData function to write data to  json file and update current data obj
async function WriteData(data) {
  try {
    await WriteAllData(data);
    data = ReadData();
  } catch (err) {
    throw err;
  }
}
// function to filter only top 10 matches for a callback
function filterTop10(arr, cb) {
  let ans = [];
  let len = 0;
  for (let i of arr) {
    if (cb(i)) {
      ans.push(i);
      if (++len === 10) {
        return ans;
      }
    }
  }
  return ans;
}

function CORS(req, res, next) {
  if (req.headers.origin) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, token"
    );
  }
  next();
}

module.exports = { Pokemon, filterTop10, WriteData, ReadData, CORS };
