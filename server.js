let express = require("express");
let path = require("path");
let cors = require("cors");
let restaurants = require("./testRestaurants");
let guests = require("./testGuests");
let Knex = require("knex");
var session = require("express-session");

let app = express();
let port = process.env.PORT || 8080;

// use this for prod
// const createTcpPool = async (config) => {
//   return Knex({
//     client: "pg",
//     connection: {
//       user: process.env.DB_USER,
//       password: process.env.DB_PASS,
//       database: process.env.DB_NAME,
//       host: process.env.DB_HOST, // uses internal private IP
//       port: process.env.DB_PORT,
//     },
//     ...config,
//   });
// };

// use this for local dev
const createTcpPool = async (config) => {
  return Knex({
    client: "pg",
    connection: {
      user: "postgres",
      password: "12345",
      database: "main-db",
      host: "34.170.246.86", // uses external public IP
    },
    ...config,
  });
};

const createPool = async () => {
  const config = { pool: {} };
  config.pool.max = 5;
  config.pool.min = 5;
  config.pool.acquireTimeoutMillis = 60000; // 60 seconds
  config.pool.createTimeoutMillis = 30000; // 30 seconds
  config.pool.idleTimeoutMillis = 600000; // 10 minutes
  config.pool.createRetryIntervalMillis = 200; // 0.2 seconds
  return createTcpPool(config);
};

let pool;

app.use(async (req, res, next) => {
  if (pool) {
    return next();
  }
  try {
    pool = await createPool();
    next();
  } catch (err) {
    logger.error(err);
    return next(err);
  }
});

let options = {
  dotfiles: "ignore",
  extensions: ["html", "htm"],
  index: "index.html",
};
app.use("/", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static("./build", options));
app.use(
  session({
    name: "session",
    secret: "secure-pwd", // TODO: change this to env vat for security
    resave: false,
    maxAge: 30 * 60 * 1000, // 30 minutes
  })
);

app.post("/api/addGuest", async (req, res) => {
  try {
    result = await pool
      .insert([
        {
          fname: req.body.fname,
          lname: req.body.lname,
          phone: req.body.phone,
          email: req.body.email,
        },
      ])
      .into("guests");
    console.log("Added new guest", result);
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json();
  }
});

app.post("/api/addOwner", async (req, res) => {
  try {
    result = await pool
      .insert([
        {
          fname: req.body.fname,
          lname: req.body.lname,
          email: req.body.email,
        },
      ])
      .into("owners");
    console.log("Added new owner", result);
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json();
  }
});

app.post("/api/guest/login", async (req, res) => {
  try {
    let row = await pool("guests").where("email", req.body.email).select("*");
    if (row.length == 1) {
      let guest = row[0];
      req.session.usr = guest;
      console.log("Logged in user:", guest);
      res.json(guest);
    } else {
      console.error(
        "Guest Login Error: either guest not found or multiple guests are found"
      );
      res.json(null);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json();
  }
});

app.post("/api/owner/login", async (req, res) => {
  try {
    let row = await pool("owners").where("email", req.body.email).select("*");
    if (row.length == 1) {
      let owner = row[0];
      req.session.usr = owner;
      console.log("Logged in user:", owner);
      res.json(owner);
    } else {
      console.error(
        "Owner Login Error: either owner not found or multiple owners are found"
      );
      res.json(null);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json();
  }
});

app.get("/api/guest/main", (req, res) => {
  res.json(restaurants);
});

app.get("/api/guest/currentBookings", (req, res) => {
  res.json(restaurants);
});

app.get("/api/guest/profile", (req, res) => {
  res.json(guests[0]);
});

app.get("/api/owner/main", (req, res) => {
  res.json(restaurants);
});

// send static files for every route
app.get("*", function (req, res) {
  res.sendFile("index.html", { root: path.join(__dirname, "./build") });
});

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
